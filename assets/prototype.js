// Поведение как на живой странице payments.flypobeda.ru (pobeda_v3):
// плашки-аккордеон (не radio-инпуты), у выбранной плашки pointer-events:none,
// в правом блоке показывается submit-item выбранного способа.
(function () {
    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-payment="root"]'));
    var submits = Array.prototype.slice.call(document.querySelectorAll('.submit-item'));
    var DURATION = 350;

    function expand(el) {
        el.style.display = 'block';
        var h = el.scrollHeight;
        el.style.overflow = 'hidden';
        el.style.height = '0px';
        el.style.opacity = '0';
        el.getBoundingClientRect(); // reflow, чтобы стартовые значения применились
        el.style.transition = 'height ' + DURATION + 'ms ease, opacity ' + DURATION + 'ms ease';
        el.style.height = h + 'px';
        el.style.opacity = '1';
        clearTimeout(el._animTimer);
        el._animTimer = setTimeout(function () {
            el.style.transition = el.style.height = el.style.overflow = el.style.opacity = '';
            el.style.display = 'block';
        }, DURATION);
    }

    function collapse(el) {
        if (el.style.display === 'none' || getComputedStyle(el).display === 'none') return;
        el.style.overflow = 'hidden';
        el.style.height = el.scrollHeight + 'px';
        el.getBoundingClientRect();
        el.style.transition = 'height ' + DURATION + 'ms ease, opacity ' + DURATION + 'ms ease';
        el.style.height = '0px';
        el.style.opacity = '0';
        clearTimeout(el._animTimer);
        el._animTimer = setTimeout(function () {
            el.style.display = 'none';
            el.style.transition = el.style.height = el.style.overflow = el.style.opacity = '';
        }, DURATION);
    }

    function open(section, animate) {
        sections.forEach(function (s) {
            var content = s.querySelector('[data-payment="content"]');
            var on = s === section;
            var wasOpen = s.classList.contains('opened');
            s.classList.toggle('opened', on);
            if (!content || on === wasOpen) return;
            if (!animate) {
                content.style.display = on ? 'block' : 'none';
            } else if (on) {
                expand(content);
            } else {
                collapse(content);
            }
        });
        var type = section.getAttribute('data-payment-type');
        submits.forEach(function (item) {
            item.classList.toggle('opened', item.getAttribute('data-submit') === type);
        });
    }

    sections.forEach(function (s) {
        var toggle = s.querySelector('[data-payment="toggle"]');
        if (toggle) toggle.addEventListener('click', function () { open(s, true); });
    });

    // по умолчанию — СБП, как на реальной странице
    if (sections.length) open(sections[0], false);

    // карта: кнопка «Оплатить» активируется, когда все поля заполнены
    var cardInputs = Array.prototype.slice.call(
        document.querySelectorAll('.payment-card .card__input'));
    var cardSubmit = document.querySelector('[data-submit="card"] .card__submit');
    function refreshCardButton() {
        var full = cardInputs.every(function (i) { return i.value.trim().length > 0; });
        if (cardSubmit) cardSubmit.classList.toggle('disabled', !full);
    }
    cardInputs.forEach(function (i) { i.addEventListener('input', refreshCardButton); });

    // клик по «Оплатить» у Инвойсбокса — здесь был бы редирект на платёжную форму Invoicebox
    var ibSubmit = document.getElementById('invoiceboxSubmit');
    if (ibSubmit) ibSubmit.addEventListener('click', function () {
        alert('Переход на платёжную форму Invoicebox (заглушка прототипа)');
    });

    // раскрытие карточки рейса и позиций корзины
    Array.prototype.slice.call(document.querySelectorAll('[data-flight="toggle"]')).forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.closest('.flight').classList.toggle('opened');
        });
    });
    Array.prototype.slice.call(document.querySelectorAll('[data-basket="toggle"]')).forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.closest('.basket-element').classList.toggle('opened');
        });
    });

    // таймер
    var el = document.querySelector('.timer__value');
    if (el) {
        var parts = el.textContent.trim().split(':');
        var left = (+parts[0]) * 60 + (+parts[1]);
        setInterval(function () {
            if (left > 0) left--;
            var m = String(Math.floor(left / 60)).padStart(2, '0');
            var s = String(left % 60).padStart(2, '0');
            el.textContent = m + ':' + s;
        }, 1000);
    }
})();
