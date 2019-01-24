const {RESTDataSource} = require("apollo-datasource-rest");

const MAX_POKEMON_ID = 802;
class Pokemon extends RESTDataSource {

  constructor() {
    super();

    this.baseURL = "https://pokeapi.co/api/v2";
  }

  async getPokemonByName(name = '') {
    //console.log(name);
    const pokemon = await this.get(`/pokemon/${name}/`);
    // console.log(pokemon);
    return pokemon;
  }

  async getPokemon(id = '') {
    //console.log(name);
    const pokemon = await this.get(`/pokemon/${id}/`);
    // console.log(pokemon);
    return pokemon;
  }

  async getType(name = '') {
    const type = await this.get(`/type/${name}/`);
    //console.log(type);
    return type;
  }

  async getPokemons(limit= MAX_POKEMON_ID, offset=1) {
    //console.log(`/pokemon/?limit=${limit}&offset=${offset}`);
    if(limit > MAX_POKEMON_ID) {
      limit = MAX_POKEMON_ID;
    }
    if(offset + limit > MAX_POKEMON_ID) {
      offset = MAX_POKEMON_ID - limit;
      //console.log(offset);
    }
    const pokemons = await this.get(`/pokemon/?limit=${limit}&offset=${offset}`);
    const tmp = pokemons.results.map((item, i) => {
        item.id = offset + i + 1;
         return {...item};
       }
     );
     //console.log(tmp.length);
    return tmp;
  }
}

module.exports = Pokemon;
