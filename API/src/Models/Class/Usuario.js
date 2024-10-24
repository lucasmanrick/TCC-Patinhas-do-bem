const { connection } = require(`../../Config/db`);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UsuariosBloqueados = require('./UsuariosBloqueados');

class Usuario {
  constructor(ID,NomeUsuario,DataNasc,Email,Senha,Cep,Rua,Numero, Bairro,Estado,Cidade) {
    this.ID = ID?ID:null;
    this.NomeUsuario = NomeUsuario;
    this.DataNasc = DataNasc;
    this.Email = Email;
    this.Senha = Senha;
    this.Cep = Cep;
    this.Rua = Rua;
    this.Numero = Numero; 
    this.Bairro = Bairro;
    this.Estado = Estado;
    this.Cidade = Cidade
  }

  async cadastraUsuarioQuery () {
    const conn = await connection();
      try {                                                                                                                                                                               
        const uRes = await conn.query("INSERT INTO Usuario (Nome, CEP, Rua, Numero, Bairro, Estado, DataNasc, Email, Senha, Administrador,Cidade) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[this.NomeUsuario,this.Cep,this.Rua,this.Numero,this.Bairro,this.Estado,this.DataNasc,this.Email,this.Senha,0,this.Cidade]);
        if(uRes[0].affectedRows >=1) {
          return {success: "você conseguiu se cadastrar com sucesso!!", IDUsuario: uRes[0].insertId}
        }else {
          return {error:"não foi possivel cadastrar o usuário no nosso sistema tente novamente!"}
        }
      }
      catch (e) {
        return {error:"houve um erro ao tentar completar o envio de dados: " & e.message }
      }
  }

 static async verificaExistenciaUsuarioQuery (Email) {
    const conn = await connection();
    try{
      const existenceReturn = await conn.query("Select Email from Usuario Where Email = ?", [Email])

      if(existenceReturn[0].length > 0) {
        return {error:"Um usuário com esse Email já está registrado em nosso sistema, tente utilizar outro!"}
      }else {
        return {success: "Usuário apto a prosseguir com cadastro."}
      }
    }catch(e) {
      return{error:e.message}
    }
  }

  async autenticaUsuarioQuery () {
    const conn = await connection();

    try {
      const authResponse = await conn.query("Select * from Usuario where Email = ?",[this.Email])
      if(authResponse[0].length > 0) {

        const verifyIfUserBlock = await UsuariosBloqueados.pegaUsuarioBloqueadoPeloIDQuery(authResponse[0][0].ID)
        console.log(verifyIfUserBlock)

        if(verifyIfUserBlock.warning) return {error:"não é possivel entrar nesta conta, pois a mesma se encontra BANIDA de nosso sistema"}
        if(verifyIfUserBlock.error) return {error:"não foi possivel validar se a conta está livre para acessar nosso site, por favor tente novamente"} 

        const authVerify = await bcrypt.compare(this.Senha,authResponse[0][0].Senha)
        if(authVerify === true) {
          const token = jwt.sign({ ID: authResponse[0][0].ID, Nome:authResponse[0][0].Nome,CEP:authResponse[0][0].CEP,Rua:authResponse[0][0].Rua,Numero:authResponse[0][0].Numero,Bairro:authResponse[0][0].Bairro,Estado:authResponse[0][0].Estado,DataNasc:authResponse[0][0].DataNasc,Email:authResponse[0][0].Email,Administrador:authResponse[0][0].Administrador,Cidade:authResponse[0][0].Cidade}, process.env.SECRET, {
            expiresIn: 10000 // tempo em que o token irá expirar em segundos
          });

          return{success: "Usuário logado com sucesso",auth:true,token:token, Administrador:authResponse[0][0].Administrador}
          
        } else {
          return {error:"Email ou senha incorreta.",auth:false}
        }
   
      }else {
        return {error:"não foi identificado nenhum usuário com essas credenciais"}
      }
    }
    catch (e) {
      return {error:e.message}
    }
  }


  async editaDadosCadastraisQuery () {
    const conn = await connection();
    try{                
      const sendToDBRefreshUserData = await conn.query("UPDATE usuario SET Nome = ?, CEP=?, Rua=?, Numero=?, Bairro=?, Estado=?, DataNasc=?, Email=?, Senha=?,Cidade=? WHERE ID=?",[this.NomeUsuario,this.Cep,this.Rua,this.Numero,this.Bairro,this.Estado,this.DataNasc,this.Email,this.Senha,this.Cidade,this.ID])
      console.log(sendToDBRefreshUserData)
      if(sendToDBRefreshUserData[0].affectedRows >=1) {
        return{success:"atualizado os dados do usuário com sucesso"}
      }else {
        return{error:"não foi possivel atualizar os dados do usuário, tente novamente!"}
      }
    }catch(e) {
      return{error:e.message}
    }
   }


  static async removeDadosUsuarioQuery(UsuarioRequisitorID,UsuarioASerRemovido) {
    const conn = await connection();
    try{
      if(UsuarioRequisitorID && UsuarioASerRemovido) {
        const deletingSomeUser = await conn.query("DELETE FROM usuario WHERE ID=?",[UsuarioASerRemovido]);
       
        if(deletingSomeUser[0].affectedRows >=1) {
          return {success:"usuário removido por completo do sistema"}
        }
      } else if (UsuarioRequisitorID && !UsuarioASerRemovido) {
        const deletingYourselfProfile = await conn.query("DELETE FROM usuario WHERE id=?",[UsuarioRequisitorID])
        if(deletingYourselfProfile[0].affectedRows >=1) {
          return {success:"seu perfil foi deletado com sucesso de nosso sistema!."}
        }
      }
    }catch(e) {
      return {error:e.message}
    }
   }

   static async verificaPermissaoAdmQuery (UserID) {
    const conn = await connection();
    try {
       const checkPermissionUser = await conn.query("SELECT * FROM USUARIO WHERE ID=? && Administrador=?",[UserID,1])
      if(checkPermissionUser[0].length >=1) return {success:"o usuário é administrador"}
      return {error:"o usuário não é administrador"}
      }catch (e) {
      return {error:e.message}
    }
   }


   static async bloquearUmUsuarioQuery (UserID, IDBloqueado) {
    const conn = await connection();
    try {
    if (UserID && IDBloqueado) {
      const checkPermissionUser = await  Usuario.verificaPermissaoAdmQuery(UserID);
      if(checkPermissionUser.success) {
        const blockUser = await conn.query("INSERT INTO UsuariosBloqueados (dataBloqueio,IDBloqueado,IDBloqueador) VALUES (?,?,?)",[new Date(),IDBloqueado,UserID])
        if (blockUser[0].affectedRows>= 1) return {success:"usuário bloqueado com sucesso, agora o mesmo não tem mais acesso ao site"}
        return {error:"houve um erro no processo de bloqueio, por favor tente novamente 404"}
      }else {
        return {error:"você não tem permissão para bloquear um usuário"}
      }
    }

    }catch(E) {
      return {error:E.message}
    }
  }

}

module.exports = Usuario