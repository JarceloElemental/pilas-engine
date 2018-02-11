/// <reference path="estado.ts"/>

class EstadoEditor extends Estado {
  entidades: any;
  sprites: any;
  texto: any;
  historia: any;
  fondo: any;

  init(datos) {
    this.pilas = datos.pilas;
    this.entidades = datos.escena.actores;
    this.cuando_termina_de_mover = datos.cuando_termina_de_mover;
    this.cuando_comienza_a_mover = datos.cuando_comienza_a_mover;
    this.sprites = {};

    let fondo = this.game.add.tileSprite(-100, -100, this.game.width + 200, this.game.height + 200, "plano");
    fondo.fixedToCamera = true;
    this.fondo = fondo;
  }

  cuando_termina_de_mover(a: any) {}

  cuando_comienza_a_mover(a: any) {}

  create() {
    super.create();
    this.game.stage.backgroundColor = "5b5";
  }

  update() {
    this.fondo.tilePosition.x = -pilas.game.camera.x;
    this.fondo.tilePosition.y = -pilas.game.camera.y;

    this.entidades = this.entidades.map(e => {
      var sprite = null;

      if (!this.sprites[e.id]) {
        sprite = new ActorDentroDelEditor(this.game, 0, 0, e.imagen);
        sprite.iniciar(pilas, e);

        sprite.al_terminar_de_arrastrar = this.cuando_termina_de_mover;
        sprite.al_comenzar_a_arrastrar = this.cuando_comienza_a_mover;

        this.world.add(sprite);
        this.sprites[e.id] = sprite;
      } else {
        sprite = this.sprites[e.id];
      }

      return e;
    });
  }
}
