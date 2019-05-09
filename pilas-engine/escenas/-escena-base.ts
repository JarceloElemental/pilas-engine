class EscenaBase {
  pilas: Pilas;
  actores: Actor[];
  id: number;
  camara: Camara;
  fondo: string;
  control: Control;
  _gravedad_x: number = 0;
  _gravedad_y: number = 1;
  eventos: EventosDeEscena;

  constructor(pilas) {
    this.pilas = pilas;
    this.actores = [];
    this.pilas.utilidades.obtener_id_autoincremental();
    this.camara = new Camara(pilas);
    this.pilas.escenas.definir_escena_actual(this);
    this.control = new Control(pilas);
    this.eventos = new EventosDeEscena(pilas);
  }

  agregar_actor(actor: Actor) {
    this.actores.push(actor);
  }

  get gravedad_x() {
    return this._gravedad_x;
  }

  set gravedad_x(v: number) {
    this._gravedad_x = v;
    this.actualizar_gravedad();
  }

  get gravedad_y() {
    return this._gravedad_y;
  }

  set gravedad_y(v: number) {
    this._gravedad_y = v;
    this.actualizar_gravedad();
  }

  private actualizar_gravedad() {
    this.pilas.modo.matter.world.setGravity(this._gravedad_x, this._gravedad_y);
  }

  /*
   * Retorna un posible nombre para un actor sin que se repita con uno existente.
   *
   * Por ejemplo si se invoca con un nombre propuesto tipo 'nave' en una
   * escena que ya tiene dos actores llamados 'nave1' y 'nave2' esta función
   * retornará el nombre 'nave3'.
   */
  obtener_nombre_para(nombre_propuesto: string) {
    let nombres_que_pueden_colisionar = this.actores
      .map(e => e.nombre)
      .filter(e => e.startsWith(nombre_propuesto));
    let contador = 1;
    let nombre_a_sugerir = nombre_propuesto;

    while (nombres_que_pueden_colisionar.indexOf(nombre_a_sugerir) > -1) {
      contador += 1;
      nombre_a_sugerir = nombre_propuesto + contador;
    }

    return nombre_a_sugerir;
  }

  serializar() {
    return {
      camara_x: this.camara.x,
      camara_y: this.camara.y,
      fondo: this.fondo
    };
  }

  pre_actualizar() {}

  actualizar() {}

  actualizar_actores() {
    let actores_a_eliminar = [];

    this.actores.map(actor => {
      if (!actor._vivo) {
        actor.sprite.destroy();

        if (actor._texto) {
          actor._texto.destroy();
        }

        if (actor._fondo) {
          actor._fondo.destroy();
        }

        actores_a_eliminar.push(actor);
        return;
      }

      actor.pre_actualizar();
      actor.actualizar_sensores();
      actor.actualizar_habilidades();
      actor.actualizar();
    });

    actores_a_eliminar.map(actor => {
      this.quitar_actor_luego_de_eliminar(actor);
    });
  }

  quitar_actor_luego_de_eliminar(actor: Actor) {
    let posicion = this.actores.indexOf(actor);
    let id = actor["id"];

    if (posicion !== -1) {
      this.actores.splice(posicion, 1);
    } else {
      throw Error(
        `Se intentó eliminar un actor inexistente en la escena: id=${id} etiqueta=${
          actor.etiqueta
        }.`
      );
    }
  }

  terminar() {
    this.actores.map(e => e.eliminar());
    this.actualizar();
    this.actualizar_actores();
    this.control.terminar();
  }

  cuando_hace_click(x, y, evento_original) {}

  cuando_mueve(x, y, evento_original) {}
}
