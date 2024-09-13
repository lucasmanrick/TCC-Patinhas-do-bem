

class Usuario {
  constructor(NomeUsuario,DataNasc,Email,Senha,Cep,Rua,Numero, Bairro,Estado,Cidade) {
    this.NomeUsuario = NomeUsuario,
    this.DataNasc = DataNasc,
    this.Email = Email,
    this.Senha = Senha,
    this.Cep = Cep,
    this.Rua = Rua,
    this.Numero = Numero, 
    this.Bairro = Bairro,
    this.Estado = Estado,
    this.Cidade = Cidade
  }
}

module.exports = Usuario