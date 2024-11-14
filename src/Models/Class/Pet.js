const { connection } = require("../../Config/db");
const Interesse = require("./Interesse");

class Pet {
  constructor(dataRegistro,TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador,PetID) {
    this.dataRegistro = dataRegistro;
    this.TipoAnimal = TipoAnimal;
    this.Linhagem = Linhagem;
    this.Status = Status?Status:1;
    this.Idade = Idade;
    this.Sexo = Sexo;
    this.Cor = Cor;
    this.Descricao = Descricao;
    this.IDDoador = IDDoador;
    this.PetID = PetID;
  }


  async cadastraPetQuery() {
    const conn = await connection()
    try {
      const insertNewPet = await conn.query('insert into pet (dataRegistro,TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador) VALUES (?,?,?,?,?,?,?,?,?)', [this.dataRegistro, this.TipoAnimal, this.Linhagem, this.Status, this.Idade, this.Sexo, this.Cor, this.Descricao, this.IDDoador])
      if (insertNewPet[0].insertId) {

        return { success: "pet cadastrado com sucesso", idDoPet: insertNewPet[0].insertId }
      } else {
        return { error: "não foi possivel cadastrar o pet no banco de dados." }
      }
    }
    catch (e) {
      return ({ error: e.message })
    }
  }
  
  async editPetInfoQuery() {
    const conn = await connection();
    try {
      const responseForEditRequest = await conn.query("UPDATE pet SET TipoAnimal=?, Linhagem=?, Idade=?,Sexo=?,Cor=?,Descricao =? WHERE ID = ? && IDDoador = ?", [this.TipoAnimal, this.Linhagem, this.Idade, this.Sexo, this.Cor, this.Descricao, this.PetID, this.IDDoador])
      if (responseForEditRequest[0].affectedRows >= 1) {
        return { success: "Editado informações do pet solicitado" }
      } else {
        return { error: "Não foi identificado o pet ou ele não pertence a você para que seja feita as edições de dados" }
      }
    }
    catch (e) {
      return { error: e.message }
    }
  }
 static async removePetDaAdocaoQuery(IDDoador, PetID, VerifyForm) {
    const conn = await connection();

    try {
      if (VerifyForm.weHelp == true && VerifyForm.wallCheck == true) {
        const inactivatePet = await conn.query("UPDATE pet SET status = ? WHERE ID = ? AND IDDoador = ?", [0, PetID, IDDoador])
        if (inactivatePet[0].affectedRows >= 1) {
          return { success: "O pet foi inativado e vai para nosso mural de pets adotados graças a rede social" }
        } else {
          return { error: "não foi modificado nenhum registro verifique as informações e tente novamente" }
        }
      } else {
        const removePet = await conn.query("DELETE FROM pet WHERE ID=? AND IDDoador = ?", [PetID, IDDoador])
        if (removePet[0].affectedRows >= 1) {
          return { success: "Todos dados a respeito do pet foram removidos de nosso sistema." }
        } else {
          return { error: "não foi identificado um registro com os dados especificados" }
        }
      }

    } catch (e) {
      return { error: e.message.message }
    }

  }

  static async petsDeUmUsuarioQuery(UserID) { // pega todos pets de um determinado usuário
    const conn = await connection();
    try {
      const getUserPets = await conn.query("SELECT * FROM PET where IDDoador = ?", [UserID]);
      if (getUserPets[0].length >= 1) {

        getUserPets[0].forEach((e,index) => {
          e.petPicture = `https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/pets%2F${e.ID}.jpg?alt=media`
          delete e.IDDoador
        })

        return { success: "Retornando todos pets do usuário especificado", dataResponse: getUserPets[0] }
      } else {
        return { error: "O usuário especificado não possui nenhum pet cadastrado." }
      }
    }
    catch (e) {
      return { error: e.message }
    }
  }


  static async petsParaAdocaoQuery(Estado, ID,gapQuantity) { // pega todos os pets e informações do dono do mesmo estado do usuário que estão para adoção desde que não seja do proprio usuário. 
    const conn = await connection();


    try {
      const myInterests = await Interesse.meusInteressesQuery(ID);
      const verifyUsersClose = await conn.query(`select u.Estado, u.Cidade, p.IDDoador as IDDoador , p.ID as petID, p.dataRegistro, p.TipoAnimal, p.Linhagem, p.Idade, p.Sexo, p.Cor, p.Descricao from pet as p join usuario as u on u.ID = p.IDDoador WHERE u.estado = ? AND u.ID <> ? AND p.Status = 1 LIMIT 50 OFFSET ${50 * gapQuantity}`, [Estado, ID]);
     verifyUsersClose[0].forEach((e,index) => {
      if(myInterests.success) {
        myInterests.myInterests.forEach(j => {
          if(j.IDDoador === e.IDDoador) {
            e.demonstrouInteresse = true
          }
        })
      }
     
      e.petPicture = `https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/pets%2F${e.petID}.jpg?alt=media`
     })
      if(verifyUsersClose[0].length >= 1)  return { success: "retornando todos pets da proximidade do usuário, disponiveis para adoção.", dataResponse: verifyUsersClose[0] }
      
      return {error:"não foi possivel trazer informações de pets para adoção, pois não possui nenhum pet em sua região"}
    }
    catch (e) {
      return { error: e.message }
    }
  }

}


module.exports = Pet;