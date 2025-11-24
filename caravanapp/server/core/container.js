// A simple service container
const container = {
  _services: new Map(),
  _instances: new Map(),

  register(name, definition, dependencies = []) {
    this._services.set(name, { definition, dependencies });
  },

  resolve(name) {
    if (this._instances.has(name)) {
      return this._instances.get(name);
    }

    const service = this._services.get(name);
    if (!service) {
      throw new Error(`Service not found: ${name}`);
    }

    if (typeof service.definition === "function") {
      const dependencies = service.dependencies.map((dep) => this.resolve(dep));
      const instance = new service.definition(...dependencies);
      this._instances.set(name, instance);
      return instance;
    } else {
      this._instances.set(name, service.definition);
      return service.definition;
    }
  },
};

module.exports = container;
