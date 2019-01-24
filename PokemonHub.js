const {RESTDataSource} = require("apollo-datasource-rest");

class PokemonHub extends RESTDataSource {
  constructor() {
    super();

    this.baseURL = "https://db.pokemongohub.net/api/";
  }

  async getPokemonByName(name = '') {
    const pokemon = await this.get(`pokemon/${name}/`);
    //console.log(pokemon);
    return pokemon;
  }

  async getPokemonById(id, form='') {
    // console.log(id);
    // console.log(`pokemon/${id}?form=${form}`);
    const pokemon = await this.get(`pokemon/${id}?form=${form}`);

    if(pokemon !== null && pokemon.family !== null ) {
      pokemon.family = pokemon.family.map((member, index) => {
        member.index = member.id;
        if(member.form !== null) {
          member.id = member.id + '000' + index;
        }
        return member;
      });
    }
    return pokemon;
  }

  async getMoveSets(id) {
    const movesets = await this.get(`movesets/with-pokemon/${id}/`);
    return movesets;
  }

  async getGen1Pokemon(gen) {
  
  }
}

module.exports = PokemonHub;
