const DEPURAR_MENSAJES = false;

class Mensajes {
  pilas: Pilas;
  fondo: Phaser.GameObjects.TileSprite;

  constructor(pilas: Pilas) {
    this.pilas = pilas;
    this.agregar_manejador_de_eventos();
  }

  private agregar_manejador_de_eventos() {
    window.addEventListener("message", this.atender_mensaje.bind(this), false);
  }

  atender_mensaje(e) {
    let metodo = "atender_mensaje_" + e.data.tipo;
    let datos = e.data;

    if (DEPURAR_MENSAJES) {
      console.log("[IN] llega el mensaje " + metodo);
    }

    if (this[metodo]) {
      this[metodo](datos);
    } else {
      console.error(`Imposible llamar al evento ${metodo}`, datos);
    }
  }

  atender_mensaje_iniciar_pilas(datos) {
    this.pilas.iniciar_phaser(datos.ancho, datos.alto);
  }

  atender_mensaje_definir_estados_de_depuracion(datos) {
    this.pilas.depurador.definir_estados_de_depuracion(datos);
  }

  emitir_mensaje_al_editor(nombre, datos = null) {
    datos = datos || {};
    datos.tipo = nombre;

    if (DEPURAR_MENSAJES) {
      console.log("[OUT] Emitiendo el mensaje " + nombre);
    }

    window.parent.postMessage(datos, HOST);
  }

  atender_mensaje_define_escena(datos) {
    this.pilas.definir_modo("ModoEditor", {
      pilas: this.pilas,
      escena: datos.escena
    });
  }

  atender_mensaje_actualizar_escena_desde_el_editor(datos) {
    this.pilas.modo.posicionar_la_camara(datos.escena);
  }

  atender_mensaje_ejecutar_proyecto(datos) {
    let parametros = {
      pilas: this.pilas,
      nombre_de_la_escena_inicial: datos.nombre_de_la_escena_inicial,
      permitir_modo_pausa: datos.permitir_modo_pausa,
      codigo: datos.codigo,
      proyecto: datos.proyecto
    };

    this.pilas.definir_modo("ModoEjecucion", parametros);
  }

  emitir_excepcion_al_editor(error, origen) {
    let detalle = {
      mensaje: error.message,
      stack: error.stack.toString()
    };

    this.pilas.modo.add.text(
      5,
      5,
      "Se ha producido un error. Vea el intérprete por favor.",
      { font: "16px verdana" }
    );
    this.pilas.modo.add.text(5, 5 + 20, detalle.mensaje, {
      font: "14px verdana",
      fill: "#ddd"
    });
    this.pilas.modo.add.text(5, 5 + 20 + 20, detalle.stack, {
      font: "10px verdana"
    });

    this.pilas.pausar();
    this.emitir_mensaje_al_editor("error_de_ejecucion", detalle);
    console.error(error);
  }

  atender_mensaje_selecciona_actor_desde_el_editor(datos) {
    this.pilas.modo.destacar_actor_por_id(datos.id);
  }

  atender_mensaje_alterar_estado_de_maximizacion(datos) {
    let elemento_canvas = document.getElementsByTagName("canvas")[0];

    if (datos.maximizar) {
      elemento_canvas.classList.add("maximizar");
    } else {
      elemento_canvas.classList.remove("maximizar");
    }
  }

  atender_mensaje_actualizar_actor_desde_el_editor(datos) {
    let sprite = this.pilas.modo.obtener_actor_por_id(datos.id);
    this.pilas.modo.actualizar_sprite_desde_datos(sprite, datos.actor);
  }

  atender_mensaje_quitar_pausa_de_phaser() {
    console.log("TODO: quitar modo pausa");
  }

  atender_mensaje_pausar_escena() {
    let parametros = {
      pilas: this.pilas
    };

    this.pilas.definir_modo("ModoPausa", parametros);
  }

  atender_mensaje_cambiar_posicion(datos) {
    this.pilas.modo.actualizar_posicion(datos.posicion);
  }

  atender_mensaje_eliminar_actor_desde_el_editor(datos) {
    this.pilas.modo.eliminar_actor_por_id(datos.id);
  }
}
