const {ApolloServer, gql} = require("apollo-server");
const RandomUser = require("./RandomUser.js");
const Pokemon = require("./Pokemon.js");
const PokemonHub = require("./PokemonHub.js");

const typeDefs = gql `
  type Language {
    name: String
    url: String
  }

  type TypeName {
    language: Language
    name: String
  }

  type PokemonTypeDetail {
    id: Int
    name: String
    names: [TypeName]
    pokemon: [PokemonsItemWrapper]
  }

  type PokemonType {
    name: String
    url: String
  }

  type PokemonTypes {
    slot: String
    type: PokemonType
  }

  type Sprites {
    back_female: String
    back_shiny_female: String
    back_default: String
    front_female: String
    front_shiny_female: String
    back_shiny: String
    front_default: String
    front_shiny: String
  }

  type TypeChart {
    type: String
    status: String
    statusModifier: String
    effectiveness: Float
  }

  type Family {
    id: Int
    index: Int
    name: String
    form: String
    type1: String
    type2: String
    generation: Int
    atk: Int
    sta: Int
    def: Int
    maxcp: Int
  }

  type Form {
    name: String
    value: String
  }

  type Pokemon {
    name: String
    form: String
    forms: [Form]
    id: Int
    height: Float
    weight: Float
    type1: String
    type2: String
    atk: Int
    sta: Int
    def: Int
    isMythical: Boolean
    isLegendary: Boolean
    generation: Int
    candyToEvolve: Int
    kmBuddyDistance: Int
    baseCaptureRate: Float
    description: String
    family: [Family]

    buddySize: Int
    baseFleeRate: Float
    kmDistanceToHatch: Int
    thirdMoveStardust: Int
    thirdMoveCandy: Int
    male: Boolean
    female: Boolean
    genderless: Boolean
    maxcp: Int
    weatherInfluences: [String]
    typeChart: [TypeChart]
    sprites: Sprites
    types: [PokemonTypes]
    index: Int
  }

  type Move {
    id: Int
    name: String
    type: String
    power: Int
    duration: Int
    energy: Int
    damageWindow: Int
    energyBars: Int
    critPercentage: Int
    isQuickMove: Int
    damageWindowStart: Int
    damageWindowEnd: Int
    pvpPower: Int
    pvpEnergy: Int
    pvpDuration: Int
    pokemonId: Int
    moveId: Int
    typeChart: [TypeChart]
  }

  type MoveSet {
    quickMove: Move
    chargeMove: Move
    isQuickMoveBoostedByWeather: Boolean
    isChargeMoveBoostedByWeather: Boolean
    weaveDPS: Float
    tdo: Float
    timeToFirstActivation: Int
  }

  type PokemonsItem {
    name: String
    url: String
    id: Int
  }

  type PokemonsItemWrapper {
    slot: Int
    pokemon: PokemonsItem
  }

  type Name {
    title: String
    first: String
    last: String
  }

  type TimeZone {
    description: String
    offset: String
  }

  type Location {
    street: String
    city: String
    state: String
    postcode: String,
    timezone: TimeZone
  }

  type Picture {
    large: String
    medium: String
    thumbnail: String
  }

  type Login {
    username: String
  }

  type User {
    gender: String
    name: Name
    location: Location
    email: String
    phone: String
    cell: String
    picture: Picture
    nat: String
    login: Login
  }

  type Query {
    getUser(gender: String): User
    getUsers(people: Int, gender: String): [User]

    getPokemon(id: Int): Pokemon
    getPokemons(limit: Int, offset: Int): [PokemonsItem]

    getType(name: String): PokemonTypeDetail

    getPokemonFromHub(name: String): Pokemon
    getPokemonById(id: Int, form: String): Pokemon
    getPokemonsByGen(gen: Int): [Pokemon]

    getMoveSets(id: Int): [MoveSet]
  }
`;

const resolvers = {
  Query: {
    getUser: async(_, {
      gender
    }, {dataSources}) => dataSources
      .RandomUser
      .getUser(gender),

    getUsers: async(_, {
      people,
      gender
    }, {dataSources}) => dataSources
      .RandomUser
      .getUsers(people, gender),

    getPokemon: async(_, {
      id
    }, {dataSources}) => dataSources
      .Pokemon
      .getPokemon(id),

    getType: async(_, {
      name
    }, {dataSources}) => dataSources
      .Pokemon
      .getType(name),

    getPokemons: async(_, {limit, offset}, {dataSources}) => dataSources
      .Pokemon
      .getPokemons(limit, offset),

    getPokemonFromHub: async(_, {
      name
    }, {dataSources}) => dataSources
      .PokemonHub
      .getPokemonByName(name),

    getPokemonById: async(_, {id, form}, {dataSources}) => dataSources
        .PokemonHub
        .getPokemonById(id, form),

    getPokemonsByGen: async(_, {gen}, {dataSources}) => dataSources
        .PokemonHub
        .getPokemonsByGen(gen),

    getMoveSets: async(_, {
        id
      }, {dataSources}) => dataSources
        .PokemonHub.getMoveSets(id)
  }
};

const server = new ApolloServer({
  cors: true,
  introspection: true,
  playground: true,
  typeDefs,
  resolvers,
  dataSources: () => ({RandomUser: new RandomUser(), Pokemon: new Pokemon(), PokemonHub: new PokemonHub()})
});

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
  });
