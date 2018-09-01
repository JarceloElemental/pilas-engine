import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | pilas contenido de log", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{pilas-contenido-de-log}}`);

    assert.dom("*").hasText("");

    // Template block usage:
    await render(hbs`
      {{#pilas-contenido-de-log}}
        template block text
      {{/pilas-contenido-de-log}}
    `);

    assert.dom("*").hasText("template block text");
  });
});
