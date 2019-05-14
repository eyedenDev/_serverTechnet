module.exports = {
  //  @func       FormStartComponent
  //  @purpose    create & form opening tag
  //  @params     class, action, auto completion
  //  @defaults
  FormStartComponent: (_class = 'mt-4', _action = '', _auto = 'off') => {
    this.class = _class;
    this._action = _action;
    this._auto = _auto;
    return `<form class=${_class} action=${_action}  method="post" enctype="multipart/form-data" autocomplete=${_auto}>`;
  },

  //  @func       FormEndComponent
  //  @purpose    create & form closing tag
  //  @params     none
  FormEndComponent: () => {
    return `</form>`;
  },

  //  @func       FormGroupRowStart
  //  @purpose    create & form group row tag
  //  @params     addClass  class added to form-group... omitOthers Bool to remove form-group clas
  FormGroupRowStart: (addClass = null, omitOthers = false) => {
    this.addClass = addClass;
    this.omitOthers = omitOthers;
    const returnDivStart =
      omitOthers !== false
        ? `<div class="${addClass}">`
        : addClass !== null
          ? `<div class="form-group${addClass}">`
          : '<div class="form-group">';
    return returnDivStart;
  },

  //  @func       FormGroupRow
  //  @purpose    return form group row end tag
  //  @params     none
  FormRowEnd: () => {
    return `</div>`;
  },
  TextFieldGroup: (
    type = 'text',
    name,
    label = null,
    placeholder = null,
    value = '',
    required = false,
    error = null,
    info = null,
    onChange = null,
    disabled = false,
    min = null,
    max = null,
    step = null
  ) => {
    this.type = type;
    this.name = name;
    this.label = label;
    this.placeholder = placeholder;
    this.value = value;
    this.required = required;
    this.error = error;
    this.info = info;
    this.onChange = onChange;
    this.disabled = disabled;
    this.min = min;
    this.max = max;
    this.step = step;

    var showLabel =
        label !== null ? `<label for="${name}">${label}</label>` : '',
      addId = label !== null ? `id="${name}"` : '',
      showInfo =
        info !== null
          ? `<small class="form-text text-muted">${info}</small>`
          : '',
      showError =
        error !== null ? `<div class="invalid-feedback">${error}</div>` : '',
      inputClass = error == 'is-invalid' ? 'error' : 'form-control',
      isRequired = required !== false ? ' required' : '',
      changeIt = onChange !== null ? ` onchange="${onchange}"` : '';
    isDisabled = disabled !== false ? ' disabled' : '';
    (showMin = min !== null && type == 'number' ? ` min="${min}"` : ''),
    (showMax = max !== null && type == 'number' ? ` max="${max}"` : ''),
    (setStep = step !== null ? ` step="${step}"` : '');

    return `
      <div class="form-group">${showLabel}<input type="${type}" class="${inputClass}" placeholder="${placeholder}" name="${name}" ${addId} value="${value}" ${isDisabled}${isRequired}${changeIt}${showMin}${showMax}${setStep}/>${showInfo}${showError}</div>`;
  },
  PairedTextFields: (
    f1Name = '',
    f1Placeholder = '',
    f1Value = '',
    f2Name = '',
    f2Placeholder = '',
    f2Value = '',
    fieldOptions
  ) => {
    this.f1Name = f1Name;
    this.f1Placeholder = f1Placeholder;
    this.f1Value = f1Value;
    this.f2Name = f2Name;
    this.f2Placeholder = f2Placeholder;
    this.f2Value = f2Value;
    this.fieldOptions = fieldOptions;
    var returnGroup = '<div class="form-group row">';
    // console.log(fieldOptions);

    fieldOptions.forEach(function(item, index, array) {
      // console.log(item.required);
      // console.log(item.type);
      // console.log(item);

      var inputType = item.type === undefined ? 'text' : '$info.type',
        showLabel =
          item.label == undefined
            ? ''
            : index == 0
              ? `<label for="${f1Name}">${label}</label>`
              : `<label for="${f2Name}">${label}</label>`,
        addOuterClass =
          item.outer_class !== undefined ? ` ${item.outer_class}` : '',
        addInnerClass =
          item.inner_class !== undefined ? ` ${item.inner_class}` : '',
        addInputClass =
          item.input_class !== undefined ? ` ${item.input_class}` : '',
        addId =
          item.label == undefined
            ? ''
            : index == 0
              ? ` id="${f1Name}"`
              : ` id="${f2Name}"`,
        showInfo =
          item.info !== undefined
            ? `<small class="form-text text-muted">${item.info}</small>`
            : '',
        showError =
          item.error !== undefined
            ? `<div class="invalid-feedback">${item.error}</div>`
            : '',
        inputClass =
          item.error !== undefined && item.error == 'is-invalid'
            ? 'error'
            : 'form-control',
        isRequired =
          item.required !== undefined && item.required !== false
            ? ' required'
            : '',
        changeIt =
          item.onChange !== undefined ? ` onchange="${item.onchange}"` : '';
      isDisabled =
        item.disabled !== undefined && item.disabled !== false
          ? ' disabled'
          : '',
      showMin =
        item.min !== undefined && item.type == 'number'
          ? ` min="${item.min}"`
          : '',
      showMax =
          item.max !== undefined && item.type == 'number'
            ? ` max="${item.max}"`
            : '',
      setStep = item.step !== undefined ? ' step="any"' : '',
      // returnGroup +=`
      // <div class="form-group row${addOuterClass}">
      //   <div class="col${addInnerClass}">`;
      returnGroup += `<div class="col">`;
      returnGroup +=
        index == 0
          ? `<input type="${inputType}" class="form-control${addInputClass}" placeholder="${f1Placeholder}" value="${f1Value}"${isRequired}${isDisabled}${showMin}${showMax}${setStep}${changeIt}/>${showInfo}${showError}</div>`
          : `<input type="${inputType}" class="form-control${addInputClass}" placeholder="${f2Placeholder}" value="${f2Value}"${isRequired}${isDisabled}${showMin}${showMax}${setStep}${changeIt}/>${showInfo}${showError}</div>`;
    });

    // returnGroup +=`</div></div></div>`;
    returnGroup += '</div>';

    return returnGroup;
  },
  returnTest: (
    f1Name = '',
    f1Placeholder = '',
    f1Value = '',
    f2Name = '',
    f2Placeholder = '',
    f2Value = '',
    fieldOptions
  ) => {
    this.f1Name = f1Name;
    this.f1Placeholder = f1Placeholder;
    this.f1Value = f1Value;
    this.f2Name = f2Name;
    this.f2Placeholder = f2Placeholder;
    this.f2Value = f2Value;
    this.fieldOptions = fieldOptions;
    var returnGroup = '<div class="form-group row">';

    fieldOptions.forEach(function(item, index, array) {
      // console.log(item.required);
      // console.log(item.type);
      // console.log(item);

      var inputType = item.type === undefined ? 'text' : item.type,
        showLabel =
          item.label == undefined
            ? ''
            : index == 0
              ? `<label for="${f1Name}">${label}</label>`
              : `<label for="${f2Name}">${label}</label>`,
        addId =
          item.label == undefined
            ? ''
            : index == 0
              ? ` id="${f1Name}"`
              : ` id="${f2Name}"`,
        showInfo =
          item.info !== undefined
            ? `<small class="form-text text-muted">${item.info}</small>`
            : '',
        showError =
          item.error !== undefined
            ? `<div class="invalid-feedback">${item.error}</div>`
            : '',
        inputClass =
          item.error !== undefined && item.error == 'is-invalid'
            ? 'error'
            : 'form-control',
        isRequired =
          item.required !== undefined && item.required !== false
            ? ' required'
            : '',
        changeIt =
          item.onChange !== undefined ? ` onchange="${item.onchange}"` : '';
      isDisabled =
        item.disabled !== undefined && item.disabled !== false
          ? ' disabled'
          : '';
      (showMin =
        item.min !== undefined && item.type == 'number'
          ? ` min="${item.min}"`
          : ''),
      (showMax =
          item.max !== undefined && item.type == 'number'
            ? ` max="${item.max}"`
            : ''),
      (setStep = item.step !== undefined ? ' step="any"' : ''),
      (returnGroup +=
          index == 0
            ? `<div class="col">${showLabel}<input type="${inputType}" class="form-control" name="${f1Name}" placeholder="${f1Placeholder}" value="${f1Value}" ${addId}${isDisabled}${isRequired}${changeIt}${showMin}${showMax}${setStep}/>${showInfo}${showError}</div>`
            : `<div class="col">${showLabel}<input type="${inputType}" class="form-control" name="${f2Name}" placeholder="${f2Placeholder}" value="${f2Value}" ${addId}${isDisabled}${isRequired}${changeIt}${showMin}${showMax}${setStep}/>${showInfo}${showError}</div>`);
    });
    returnGroup += '</div>';
    return returnGroup;
  },
  TextFieldGroupRow: (
    type = 'text',
    name,
    label = null,
    placeholder = null,
    value = '',
    required = false,
    error = null,
    info = null,
    onChange = null,
    disabled = false,
    min = null,
    max = null,
    step = null
  ) => {
    this.type = type;
    this.name = name;
    this.label = label;
    this.placeholder = placeholder;
    this.value = value;
    this.required = required;
    this.error = error;
    this.info = info;
    this.onChange = onChange;
    this.disabled = disabled;
    this.min = min;
    this.max = max;
    this.step = step;

    var showLabel =
        label !== null ? `<label for="${name}">${label}</label>` : '',
      addId = label !== null ? `id="${name}"` : '',
      valDisplay = value !== null ? value : 'NULL',
      showInfo =
        info !== null
          ? `<small class="form-text text-muted">${info}</small>`
          : '',
      showError =
        error !== null ? `<div class="invalid-feedback">${error}</div>` : '',
      inputClass = error == 'is-invalid' ? 'error' : 'form-control',
      isRequired = required !== false ? ' required' : '',
      changeIt = onChange !== null ? ` onchange="${onchange}"` : '';
    isDisabled = disabled !== false ? ' disabled' : '';
    (showMin = min !== null && type == 'number' ? ` min="${min}"` : ''),
    (showMax = max !== null && type == 'number' ? ` max="${max}"` : ''),
    (setStep = step !== null ? ` step="${step}"` : '');

    return `
      <div class="form-group row">${showLabel}<input type="${type}" class="${inputClass}" placeholder="${placeholder}" name="${name}" ${addId} value="${valDisplay}" ${isDisabled}${isRequired}${changeIt}${showMin}${showMax}${setStep}/>${showInfo}${showError}</div>`;
  },
  TextField_Hidden: (name, value = '') => {
    this.name = name;
    this.value = value;
    return `<input type='hidden' name=${name} value=${value} />`;
  },
  Divider: (mt = null, mb = null) => {
    this.mt = mt;
    this.mb = mb;
    var add_mt = mt !== null ? ` ${mt}` : '',
      add_mb = mb !== null ? ` ${mb}` : '',
      rtn_divider = `
      <div class="form-group col-12${mt}${mb}">
        <hr>
      </div>`;
    return rtn_divider;
  },
  TextAreaGroup: (
    name,
    label = null,
    placeholder = null,
    value = '',
    required = false,
    rows = 5,
    cols = null,
    maxlength = null,
    spellcheck = false,
    disabled = false,
    readonly = false,
    error = null,
    info = null,
    onChange = null
  ) => {
    this.name = name;
    this.label = label;
    this.placeholder = placeholder;
    this.value = value;
    this.required = required;
    this.rows = rows;
    this.cols = cols;
    this.maxlength = maxlength;
    this.spellcheck = spellcheck;
    this.disabled = disabled;
    this.readonly = readonly;
    this.error = error;
    this.info = info;
    this.onChange = onChange;
    this.disabled = disabled;

    var showLabel =
        label !== null ? `<label for="${name}">${label}</label>` : '',
      addId = label !== null ? `id="${name}"` : '',
      showInfo =
        info !== null
          ? `<small class="form-text text-muted">${info}</small>`
          : '',
      showError =
        error !== null ? `<div class="invalid-feedback">${error}</div>` : '',
      inputClass = error == 'is-invalid' ? 'error' : 'form-control',
      isRequired = required !== false ? ' required' : '',
      changeIt = onChange !== null ? ` onchange="${onchange}"` : '',
      isDisabled = disabled !== false ? ' disabled' : '',
      checkSpelling = spellcheck !== false ? ' spellcheck="true"' : '';

    return `
      <div class="form-group row">
        ${showLabel}
          <textarea class="${inputClass}" placeholder="${placeholder}" name="${name}" ${addId} ${isDisabled}${isRequired}${changeIt}/>${value}</textarea>
        ${showInfo}${showError}
      </div>`;
  },
  RadioCheckGroup: (
    type = 'radio',
    name,
    label = null,
    inputs,
    checked = '',
    required = false,
    inline = true,
    disabled = false,
    error = null,
    info = null,
    onChange = null
  ) => {
    this.type = type;
    this.name = name;
    this.label = label;
    this.inputs = inputs;
    this.checked = checked;
    this.required = required;
    this.inline = inline;
    this.disabled = disabled;
    this.error = error;
    this.info = info;
    this.onChange = onChange;

    var checkOrRadio = type !== 'radio' ? 'checkbox' : 'radio',
      isInline = inline == true ? 'form-check-inline' : 'form-check',
      isDisabled = disabled !== false ? ' disabled' : '',
      showInfo =
        info !== null
          ? `<small class="form-text text-muted">${info}</small>`
          : '',
      showError =
        error !== null ? `<div class="invalid-feedback">${error}</div>` : '',
      changeIt = onChange !== null ? ` onchange="${onchange}"` : '',
      retunObj = `<div class="form-group row"><label>${label}</label>`;

    inputs.forEach((input, index) => {
      let isChecked = input.value == checked ? ' checked' : '',
        isRequired = required !== false && index == 0 ? ' required' : '',
        item_id = name + index;

      retunObj += `<div class="${isInline}">
                      <label class="form-check-label">
                        <input type="${checkOrRadio}" class="form-check-input" name="${name}" id="${item_id}" value="${
  input.value
}"${isChecked}${isRequired}>${input.value}
                      </label>
                      ${showInfo}${showError}
                    </div>`;
    });
    retunObj += '</div>';
    return retunObj;
  },

  SelectGroup: (
    name,
    id = '',
    label = null,
    options,
    selected = '',
    multiple = false,
    required = false,
    disabled = false,
    error = null,
    info = null,
    onChange = null
  ) => {
    this.name = name;
    this.id = id;
    this.label = label;
    this.options = options;
    this.selected = selected;
    this.multiple = multiple;
    this.required = required;
    this.disabled = disabled;
    this.error = error;
    this.info = info;
    this.onChange = onChange;

    var allowMultiple = multiple == true ? ' multiple ' : '',
      isDisabled = disabled !== false ? ' disabled' : '',
      isRequired = required !== false ? ' required' : '',
      isSelected,
      showInfo =
        info !== null
          ? `<small class="form-text text-muted">${info}</small>`
          : '',
      showError =
        error !== null ? `<div class="invalid-feedback">${error}</div>` : '',
      changeIt = onChange !== null ? ` onchange="${onchange}"` : '',
      retunObj = `
        <div class="form-group row">
          <label for="${id}">${label}</label>
            <select class="form-control" name="${name}" ${allowMultiple}id="${id}"${isRequired}>`;

    options.forEach((option, index) => {
      if (Array.isArray(selected)) {
        isSelected = selected.includes(option) ? ' selected' : '';
      } else {
        isSelected = option == selected ? ' selected' : '';
      }
      retunObj += `<option${isSelected}>${option}</option>`;
      // }
    });
    retunObj += `${showInfo}${showError}</select></div>`;

    return retunObj;
  },

  //  @func       FormEndComponent
  //  @purpose    create & form closing tag
  //  @params     none
  FormEndComponent: () => {
    return `</form>`;
  },

  RejectDeleteModalBtn: (deleteReject = 'delete') => {
    this.deleteReject = deleteReject;
    var returnBtn =
      '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#confirmDeleteModal">';
    switch (deleteReject) {
    case 'reject':
      returnBtn += '<i class="fas fa-thumbs-down"></i></button>';
      break;
    default:
      returnBtn += '<i class="fas fa-trash-alt"></i></button>';
    }

    return returnBtn;
  },
  ButtonComponent: (
    _type = 'submit',
    _btn_size = 'btn-sm',
    _btn_type = 'warning',
    _name = '',
    _value = '',
    _label = '',
    _btn_margin = 'mr-3'
  ) => {
    this._type = _type;
    this._btn_size = _btn_size;
    this._btn_type = _btn_type;
    this._name = _name;
    this._value = _value;
    this._label = _label;
    this._btn_margin = _btn_margin;

    return `<button type=${_type} class="btn btn-${_btn_type} ${_btn_size} ${_btn_margin}" name=${_name} value=${_value}>${_label}</button>`;
  },
  FormSudoButton: (href, name, id = null, _class = null, label = '') => {
    this.href = href;
    this.name = name;
    this.id = id;
    this._class = _class;
    this.label = label;
    var addclass = _class !== null ? _class : 'danger mr-2';

    return `<a href="${href}" id="${id}" name="${name}" class="btn btn-sm btn-${addclass}">${label}</a>`;
  },
  MeterGroup: (
    name,
    label = null,
    min = 0,
    max = 100,
    low = null,
    high = null,
    opt = null,
    value = ''
  ) => {
    this.name = name;
    this.label = label;
    this.min = min;
    this.max = max;
    this.low = low;
    this.high = high;
    this.opt = opt;
    this.value = value;

    var showLabel =
      label !== null ? `<label for="${name}">${label}</label>` : '';

    return `<div class="form-group row">${showLabel}<meter id="${name}" name="${name}" min="${min}" max="${max}" low="${low}" high="${high}" optimum="${opt}" value="${value}"></meter></div>`;
  },
  ProgressGroup: (name, label = null, max = 100, value = '') => {
    this.name = name;
    this.label = label;
    this.max = max;
    this.value = value;

    var showLabel =
        label !== null ? `<label for="${name}">${label}</label>` : '',
      percentage = (value * 100) / max;

    return `<div class="form-group row">${showLabel}<progress id="${name}" name="${name}" max="${max}" value="${value}">${percentage}</progress></div>`;
  }
};
