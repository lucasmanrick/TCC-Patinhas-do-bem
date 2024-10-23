const { connection } = require(`../../Config/db`);



class Interesse {
  constructor (ID,IDInteressado,IDPet) {
    this.ID = ID;
    this.IDInteressado = IDInteressado;
    this.IDPet = IDPet
  }

  static async demonstrarInteresseEmPetQuery(UserID, PetID) {  //query que ao demonstrar interesse em um pet verifica se o pet não é meu, se for meu não consigo demonstrar interesse, se for de outra pessoa e eu ja tiver enviado solicitação de amizade pra ela
    const conn = await connection();


    try {
      await conn.beginTransaction();
      const verifyExistencePet = await conn.query("SELECT * FROM PET WHERE ID = ? AND status=? LIMIT 1", [PetID, 1]); //select para verificar se o pet esta registrado em nosso banco de dados.
      const verifyExistenceUser = await conn.query("SELECT * FROM Usuario WHERE ID = ? LIMIT 1", [UserID]); // select para verificar se o usuário existe no banco de dados.
      const verifyExistenceIntrest = await conn.query("SELECT * FROM INTERESSE where IDInteressado = ? AND IDPet = ? LIMIT 1", [UserID, PetID]) //select para verificar se o usuário já não demonstrou interesse no pet especificado.



      if (verifyExistencePet[0][0].IDDoador === UserID) { // se existir o pet especificado e o dono deste pet for o proprio usuário demonstrando interesse.
        return { error: "O Usuário não pode demonstrar interesse no seu proprio pet" }
      }

      if (verifyExistenceIntrest[0].length >= 1) { //verifica se o usuário e o pet já não estão em um vinculo de interesse.
        return { error: "O Usuário já demonstrou interesse neste pet!" }
      } else {
        if (verifyExistencePet[0].length >= 1 && verifyExistenceUser[0].length >= 1) { // se o usuário e o pet não estiverem em um vinculo de interesse fazer:
          const intrestSendRequest = await conn.query("Insert into interesse (IDInteressado,IDPet) values (?,?)", [UserID, PetID]) // insert que faz um vinculo entre o usuário e o pet.


          const verifyFriendInvite = await conn.query("Select * from solicitacaocontato where IDSolicitante=? AND IDDestinatario = ? OR IDSolicitante=? AND IDDestinatario=? ", [UserID, verifyExistencePet[0][0].IDDoador, verifyExistencePet[0][0].IDDoador, UserID]) //select para verificar se o usuário que demonstrou interesse no pet e o dono do pet já não tem uma solicitação de amizade pendente.
          const verifyContact = await conn.query("Select * from contato where IDSolicitante=? AND IDDestinatario = ? OR IDSolicitante=? AND IDDestinatario=?", [UserID, verifyExistencePet[0][0].IDDoador, verifyExistencePet[0][0].IDDoador, UserID]) // select para verificar se o usuário que está demonstrando interesse já não tem um vinculo de contato com o dono do pet. 
          if (verifyFriendInvite[0].length >= 1) {  // SE O USUÁRIO QUE TA DEMONSTRANDO INTERESSE JÁ TIVER ENVIADO UMA SOLICITAÇÃO DE AMIZADE PARA O DONO DO PET FAZER:

            if (verifyFriendInvite[0][0].Interessado != '') { // VERIFICAR SE A SOLICITAÇÃO DE AMIZADE QUE JA POSSUI ESTÁ COM O INTERESSE EM UM DOS ANIMAIS SENDO DECLARADO.
              await conn.commit();  // SE JÁ TIVER DECLARADO INTERESSE NA SOLICITAÇÃO DE AMIZADE RETORNA MENSAGEM QUE FOI DEMONSTRADO INTERESSE COM SUCESSO.
              return { success: "O Usuário demonstrou interesse no pet com sucesso e já possui uma solicitação de contato demonstrando o interesse" }
            }
            // SE NÃO TIVER MOSTRADO O INTERESSE NO PET NA SOLICITAÇÃO DE AMIZADE JÁ EXISTENTE, NÓS DEMONSTRAMOS O INTERESSE MUDANDO O CAMPO INTERESSADO PARA 1 AO INVÉS DE 0
            const sendToFriendInviteInterest = await conn.query("UPDATE solicitacaocontato SET Interessado = ? WHERE ID=?", [1, verifyFriendInvite[0][0].ID])
            if (sendToFriendInviteInterest[0].affectedRows >= 1) {
              await conn.commit();
              return { success: "O Usuário demonstrou interesse no pet com sucesso, já possuia uma solicitação de contato com o doador porém agora foi demonstrado que a solicitação trata-se de interesse a um pet" }
            } else {
              await conn.rollback();
              return { success: "Não foi possivel demonstrar interesse no pet, pois ao tentar mudar a solicitação de contato já existente para demonstrar interesse, o registro de solicitação de amizade não foi alterado." }
            }

          } else { //SE O USUÁRIO NÃO TIVER ENVIADO UMA SOLICITAÇÃO DE CONTATO FAZER:
            if (verifyContact[0].length >= 1) { //Verificar se o usuário que está demonstrando interesse e o doador do pet já não são contatos um do outro SE FOR fazer: 
              if (verifyContact[0][0].Interessado != '') { //verificar se o contato está registrado como um contato de interesse, se tiver como contato de interesse apenas retorna mensagem de sucesso informando que o usuário já está na lista de contatos.
                //caso for enviar uma mensagem direta do usuário que demonstra o interesse no pet para o usuário dono do pet, inserir a validação aki.
                await conn.commit();
                return { success: "O Usuário demonstrou interesse no pet e ja tem o dono do mesmo na sua lista de contatos" }
              }
              const showInterest = await conn.query("UPDATE Contato SET Interessado = ? WHERE ID = ?", [1, verifyContact[0][0]])
              if (showInterest[0].affectedRows >= 1) {
                await conn.commit();
                return { success: "O Usuário demonstrou interesse no pet, já possui o dono na lista de contato e agora o contato está na lista de interesse de ambos." }
              } else {
                await conn.rollback();
                return { error: "Não foi possivel demonstrar interesse no pet, pois o contato ja está na lista de contatos, mas o sistema não conseguiu mudar a base de contato para interessado." }
              }
            }
          }


          if (intrestSendRequest[0].affectedRows >= 1) { // SE O USUÁRIO NÃO TIVER SOLICITAÇÃO DE CONTATO JÁ ENVIADA AO DONO DO PET E NÃO TIVER O DONO DO PET NA LISTA DE CONTATOS, ENVIA A SOLICITAÇÃO DE AMIZADE DEMONSTRANDO O INTERESSE EM UM DOS PETS DO OUTRO USUÁRIO.
            const sendInviteToGiver = await conn.query("Insert into solicitacaocontato (IDSolicitante,Interessado,IDDestinatario) VALUES (?,?,?)", [UserID, 1, verifyExistencePet[0][0].IDDoador])
            if (sendInviteToGiver[0].affectedRows >= 1) {
              await conn.commit();
              return { success: "Usuário demonstrou interesse em um pet novo com sucesso e foi enviado a solicitação de contato para o dono" }
            } else {
              await conn.rollback();
              return { error: "não foi possivel enviar uma solicitação de amizade para o dono do pet" }
            }
          } else {
            return { error: "não foi demonstrado interesse no pet desejado, tente novamente!" }
          }
        } else {
          return { error: "usuário informado ou pet não existem, portanto não foi possivel demonstrar interesse neste pet informado." }
        }
      }
    }
    catch (e) {
      await conn.rollback();
      return { error: e.message }
    }
  }

  static async interessadosMeuPetQuery(MeuPetID,MeuID) {
    const conn = await connection();

    try {
      const myPetChecking = await conn.query("SELECT * FROM Pet WHERE IDDoador=? AND ID=?",[MeuID,MeuPetID]);
      if(myPetChecking[0].length < 1) return {error:"o pet do qual você quer saber informações não te pertence ou não existe."}
      const interested = await conn.query("SELECT I.IDInteressado, U.Nome FROM interesse As I INNER JOIN usuario As U on U.ID = I.IDInteressado WHERE IDPet = ? ", [MeuPetID]);
      if (interested[0].length >= 1) {
        return { success: "retornando o nome de todos usuários que demonstraram interesse em seu pet", returnInteresteds: interested[0] }
      } else {
        return { error: "não foi possui nenhum interesse em seu pet informado" }
      }
    }
    catch (e) {
      return { error: e.message }
    }
  }

  static async meusInteressesQuery(MeuID) { //retorna todos pets que demonstrei interesse
    const conn = await connection();
    try {
      const verifyMyInterests = await conn.query("select p.ID, p.dataRegistro, p.TipoAnimal, p.Linhagem, p.Idade,p.Sexo,p.Cor,p.Descricao, u.Nome as NomeDoDono, u.ID AS IDDoador FROM Pet as p JOIN interesse as I JOIN usuario As u WHERE I.IDInteressado = ? AND u.ID = p.IDDoador", [MeuID])
      if (verifyMyInterests[0].length >= 1) {
        return { success: "retornando pets no quais demonstrei interesse!", myInterests: verifyMyInterests[0] }
      } else {
        return { error: "O Usuário não demonstrou interesse em nenhum pet ainda." }
      }
    }
    catch (e) {
      return { error: e.message }
    }
  }

  static async removerInteressePetQuery(PetID, UserID) {
    const conn = await connection();
    try {
      await conn.beginTransaction();
      const analyzeToRemove = await conn.query("DELETE FROM INTERESSE WHERE IDInteressado=? AND IDPet = ?", [UserID, PetID])
      console.log(analyzeToRemove)
      if (analyzeToRemove[0].affectedRows >= 1) {
      return { success: "interesse ao pet retirada com sucesso, mas a solicitação de amizade ao dono permanece!" }
        } else {
        return { error: "não foi possivel remover o interesse ao pet de nossa base de dados, o pet em questão não existe ou o usuário não demonstrou interesse nele" }
      }
    }
    catch (e) {
      await conn.rollback();
      return { error: e.message }
    }
  }

}

module.exports = Interesse