class Pet {
  constructor(dataRegistro,TipoAnimal,Linhagem,Status=1,Idade,Sexo,Cor,Descricao,IDDoador) {
    this.dataRegistro = dataRegistro;
    this.TipoAnimal = TipoAnimal;
    this.Linhagem = Linhagem;
    this.Status = Status;
    this.Idade = Idade;
    this.Sexo = Sexo;
    this.Cor = Cor;
    this.Descricao = Descricao;
    this.IDDoador = IDDoador;
  }
}


module.exports = Pet;