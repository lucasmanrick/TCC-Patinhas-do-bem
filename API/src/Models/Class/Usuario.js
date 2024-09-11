

class Usuario {
  constructor(Nome,DataNasc,Email,Senha,Cep,Rua,Numero, Bairro,Estado,Pais) {
    this.Nome = Nome,
    this.DataNasc = DataNasc,
    this.Email = Email,
    this.Senha = Senha,
    this.Cep = Cep,
    this.Rua = Rua,
    this.Numero = Numero, 
    this.Bairro = Bairro,
    this.Estado = Estado,
    this.Pais = Pais
  }
}

module.exports = Usuario