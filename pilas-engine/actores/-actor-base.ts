class ActorBase {
  tipo: String;
  sprite: Phaser.Sprite;
  pilas: Pilas;
  id_color: string;

  constructor(pilas, x, y, imagen = "sin_imagen") {
    this.pilas = pilas;
    this.sprite = new Phaser.Sprite(pilas.game, 0, 0, imagen);
    this.x = x;
    this.y = y;
    this.rotacion = 0;
    this.escala_x = 1;
    this.escala_y = 1;
    this.id_color = this.generar_color_para_depurar();

    this.pilas.game.world.add(this.sprite);
    //this.pilas.escena_actual.agregar_actor(this);
    this.sprite["actor"] = this;

    this.iniciar();

    this.sprite.update = () => {
      try {
        this.actualizar();
      } catch (e) {
        this.pilas.emitir_error_y_detener(e);
      }
    };

    this.pilas.escena_actual().agregar_actor(this);
  }

  iniciar() {}

  serializar() {
    return {
      tipo: this.tipo,
      x: Math.round(this.x),
      y: Math.round(this.y),
      centro_x: this.centro_x,
      centro_y: this.centro_y,
      rotacion: this.rotacion,
      escala_x: this.escala_x,
      escala_y: this.escala_y,
      imagen: this.sprite.key,
      transparencia: this.transparencia,
      id_color: this.id_color
    };
  }

  generar_color_para_depurar() {
    let opacidad = "FF";
    return this.pilas.utilidades.obtener_color_al_azar(opacidad);
  }

  actualizar() {}

  get imagen(): string {
    return this.sprite.frameName;
  }

  set imagen(nombre: string) {
    this.sprite.loadTexture(nombre);
  }

  set x(_x: number) {
    let { x } = this.pilas.convertir_coordenada_de_pilas_a_phaser(_x, 0);
    this.sprite.x = x;
  }

  get x() {
    let { x } = this.pilas.convertir_coordenada_de_phaser_a_pilas(this.sprite.x, 0);
    return x;
  }

  set y(_y: number) {
    let { y } = this.pilas.convertir_coordenada_de_pilas_a_phaser(0, _y);
    this.sprite.y = y;
  }

  get y() {
    let { y } = this.pilas.convertir_coordenada_de_phaser_a_pilas(0, this.sprite.y);
    return y;
  }

  set rotacion(angulo: number) {
    this.sprite.angle = -(angulo % 360);
  }

  get rotacion() {
    return -this.sprite.angle % 360;
  }

  set escala_x(s) {
    this.sprite.scale.x = s;
  }

  get escala_x() {
    return this.sprite.scale.x;
  }

  set escala_y(s) {
    this.sprite.scale.y = s;
  }

  get escala_y() {
    return this.sprite.scale.y;
  }

  get centro_y() {
    return this.sprite.anchor.y;
  }

  set centro_y(y) {
    this.sprite.anchor.y = y;
  }

  get centro_x() {
    return this.sprite.anchor.x;
  }

  set centro_x(x) {
    this.sprite.anchor.x = x;
  }

  set transparencia(t) {
    t = this.pilas.utilidades.limitar(t, 0, 100);
    this.sprite.alpha = 1 - t / 100;
  }

  get transparencia() {
    return (1 - this.sprite.alpha) * 100;
  }

  toString() {
    let clase = this.constructor["name"];
    return `<${clase} en (${this.x}, ${this.y})>`;
  }
}
