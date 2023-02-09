module.exports = class ETL {
  #extractor;

  #mapper;

  #loader;

  constructor(extractor, mapper, loader) {
    this.#extractor = extractor;
    this.#mapper = mapper;
    this.#loader = loader;
  }

  async run() {
    this.#loader.load(await this.#mapper.map(await this.#extractor.extract()));
  }
};
