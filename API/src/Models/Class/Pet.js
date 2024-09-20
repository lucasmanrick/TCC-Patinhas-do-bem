class Pet {
  constructor(dataRegistro,TipoAnimal,Linhagem,Status,Idade,Sexo,Cor,Descricao,IDDoador) {
    this.dataRegistro = dataRegistro;
    this.TipoAnimal = TipoAnimal;
    this.Linhagem = Linhagem;
    this.Status = Status?Status:1;
    this.Idade = Idade;
    this.Sexo = Sexo;
    this.Cor = Cor;
    this.Descricao = Descricao;
    this.IDDoador = IDDoador;
  }
}


module.exports = Pet;