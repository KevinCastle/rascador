(function () {
  'use strict';
  const money = value => '$' + value.toLocaleString('es-CL');
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function mount(defaults) {
    const $ = id => document.getElementById(id);
    const list = $('materials-list');
    if (list.dataset.mounted) return;
    const store = GuideMaterials.create(defaults, {
      getItem: key => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value)
    });
    list.dataset.mounted = 'true';
    let notice = '';
    function status(message = '') {
      notice = message;
      const saved = store.status;
      $('materials-status').textContent = [notice, saved.message].filter(Boolean).join(' ');
      $('materials-status').classList.toggle('materials-warning', !saved.saved);
    }
    function totals() {
      const value = store.totals();
      $('budget-total').textContent = money(value.total);
      $('budget-remaining').textContent = money(value.remaining);
      $('materials-unpriced').textContent = value.unpriced === 0 ? 'Todas las filas tienen precio' : value.unpriced + (value.unpriced === 1 ? ' fila por cotizar' : ' filas por cotizar');
      $('materials-remaining-unpriced').textContent = value.remainingUnpriced === 0 ? 'Todo lo que falta tiene precio' : value.remainingUnpriced + (value.remainingUnpriced === 1 ? ' fila pendiente por cotizar' : ' filas pendientes por cotizar');
      $('materials-owned-count').textContent = value.ownedCount + ' de ' + store.rows.length + ' materiales ya los tienes';
    }
    function card(row, index) {
      const article = element('article', 'material-card' + (row.owned ? ' is-owned' : ''));
      article.dataset.materialId = row.id;
      const heading = element('div', 'material-card-heading');
      const title = element('h3', 'material-name', row.name);
      title.id = 'material-title-' + index;
      article.setAttribute('aria-labelledby', title.id);
      const price = element('strong', 'material-price', row.total === null ? 'Por cotizar' : money(row.total));
      heading.append(title, price);
      const product = element('p', 'material-product', row.product);
      const quantity = element('p', 'material-quantity', 'Cantidad: ' + row.quantity);
      const note = element('p', 'material-note', row.note);
      article.append(heading, product, quantity, note);
      if (row.url) {
        const link = element('a', 'material-link', 'Ver producto ↗');
        link.href = row.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Ver producto: ' + row.product + ' (abre otra pestaña)');
        article.append(link);
      }
      const actions = element('div', 'material-actions');
      const ownedLabel = element('label', 'check material-owned');
      const owned = element('input');
      owned.type = 'checkbox';
      owned.name = 'owned';
      owned.checked = row.owned;
      owned.setAttribute('aria-label', 'Ya lo tengo: ' + row.name);
      ownedLabel.append(owned, document.createTextNode('Ya lo tengo'));
      const edit = element('button', 'material-edit', 'Editar');
      edit.type = 'button';
      edit.dataset.action = 'edit';
      edit.setAttribute('aria-expanded', 'false');
      edit.setAttribute('aria-label', 'Editar ' + row.name);
      edit.setAttribute('aria-controls', 'material-form-' + index);
      actions.append(ownedLabel, edit);
      article.append(actions);
      const form = element('form', 'material-form');
      form.id = 'material-form-' + index;
      form.hidden = true;
      form.setAttribute('aria-label', 'Editar ' + row.name);
      const fields = {};
      function field(name, labelText, options) {
        const wrapper = element('div', 'material-field material-field-' + name);
        const label = element('label', '', labelText);
        const input = element('input');
        input.name = name;
        input.id = 'material-' + name + '-' + index;
        label.htmlFor = input.id;
        Object.assign(input, options);
        input.value = row[name] === null ? '' : row[name];
        fields[name] = input;
        wrapper.append(label, input);
        form.append(wrapper);
        return wrapper;
      }
      field('product', 'Producto', {type: 'text', required: true, maxLength: 300});
      field('quantity', 'Cantidad', {type: 'text', required: true, maxLength: 80});
      const totalField = field('total', 'Total de esta fila · CLP', {type: 'number', min: '0', max: '1000000000', step: '1', inputMode: 'numeric', placeholder: 'Por cotizar'});
      const totalHelp = element('p', 'fine', 'Es el total de la fila: no se multiplica por la cantidad. Déjalo vacío si aún no tienes precio; 0 significa $0.');
      totalHelp.id = 'material-total-help-' + index;
      fields.total.setAttribute('aria-describedby', totalHelp.id);
      totalField.append(totalHelp);
      field('url', 'Enlace del producto (opcional)', {type: 'url', maxLength: 2048, placeholder: 'https://…'});
      const error = element('p', 'material-form-error');
      error.id = 'material-error-' + index;
      error.hidden = true;
      error.setAttribute('role', 'alert');
      error.tabIndex = -1;
      form.append(error);
      const formActions = element('div', 'material-form-actions');
      const save = element('button', 'primary', 'Guardar');
      save.type = 'submit';
      const cancel = element('button', '', 'Cancelar');
      cancel.type = 'button';
      cancel.dataset.action = 'cancel';
      const reset = element('button', 'material-row-reset', 'Restaurar esta fila');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      formActions.append(save, cancel, reset);
      form.append(formActions);
      article.append(form);
      function replace() {
        const updated = card(store.rows[index], index);
        article.replaceWith(updated);
        updated.querySelector('[data-action="edit"]').focus();
        totals();
      }
      function showError(message) {
        error.textContent = message;
        error.hidden = false;
        error.focus();
      }
      edit.addEventListener('click', () => {
        if (!form.hidden) {
          form.hidden = true;
          edit.setAttribute('aria-expanded', 'false');
          return;
        }
        const current = store.rows[index];
        Object.keys(fields).forEach(name => { fields[name].value = current[name] === null ? '' : current[name]; });
        error.hidden = true;
        form.hidden = false;
        edit.setAttribute('aria-expanded', 'true');
        fields.product.focus();
      });
      cancel.addEventListener('click', () => {
        form.hidden = true;
        edit.setAttribute('aria-expanded', 'false');
        edit.focus();
      });
      form.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); cancel.click(); }
      });
      form.addEventListener('submit', event => {
        event.preventDefault();
        const rawTotal = fields.total.value.trim();
        if (rawTotal && !/^\d+$/.test(rawTotal)) { showError('Escribe el total en pesos enteros, sin puntos ni decimales.'); return; }
        try {
          store.update(row.id, {product: fields.product.value, quantity: fields.quantity.value, total: rawTotal === '' ? null : Number(rawTotal), url: fields.url.value});
          replace();
          status('Cambios de ' + row.name + ' aplicados.');
        } catch (failure) { showError(failure.message); }
      });
      owned.addEventListener('change', () => {
        try {
          store.update(row.id, {owned: owned.checked});
          article.classList.toggle('is-owned', owned.checked);
          totals();
          status(row.name + (owned.checked ? ': ya lo tienes; se excluye de lo que falta comprar.' : ': vuelve a lo que falta comprar.'));
        } catch (failure) { owned.checked = !owned.checked; status(failure.message); }
      });
      reset.addEventListener('click', () => {
        if (!confirm('¿Restaurar los datos originales de ' + row.name + '? Se reemplazarán tus cambios y la marca «Ya lo tengo» de esta fila.')) return;
        try { store.reset(row.id); replace(); status('Fila restaurada.'); }
        catch (failure) { showError(failure.message); }
      });
      return article;
    }
    function render() {
      list.replaceChildren(...store.rows.map(card));
      totals();
    }
    $('materials-export').addEventListener('click', () => {
      try {
        const blob = new Blob([store.exportJSON()], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = element('a');
        link.href = url;
        link.download = 'rascador-materiales-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status('Respaldo exportado con los cambios guardados en la lista.');
      } catch (failure) { status('No se pudo exportar el respaldo. ' + failure.message); }
    });
    const importInput = $('materials-import');
    importInput.addEventListener('change', async () => {
      const file = importInput.files[0];
      if (!file) return;
      importInput.disabled = true;
      try {
        if (file.size > 1024 * 1024) throw new Error('El archivo supera el máximo de 1 MB.');
        const text = await file.text();
        store.validateImport(text);
        if (!confirm('¿Importar este respaldo? Reemplazará todos los cambios de materiales de este navegador, incluidas las marcas «Ya lo tengo».')) return;
        store.importJSON(text);
        render();
        status('Respaldo importado. La lista ya muestra sus datos.');
      } catch (failure) { status('No se importó el respaldo. ' + failure.message); }
      finally { importInput.value = ''; importInput.disabled = false; }
    });
    $('materials-reset').addEventListener('click', () => {
      if (!confirm('¿Restaurar todos los materiales originales? Se reemplazarán tus productos, cantidades, totales, enlaces y marcas «Ya lo tengo». Puedes exportar un respaldo antes.')) return;
      try { store.resetAll(); render(); status('Se restauraron todos los materiales originales.'); }
      catch (failure) { status(failure.message); }
    });
    render();
    status();
    return store;
  }
  globalThis.GuideMaterialsUI = {mount};
})();
