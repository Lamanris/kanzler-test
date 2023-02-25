// Burger menu
const headerBurger = document.querySelector('.header__burger')
const headerBurgerLink = document.querySelectorAll('.header-burger__link')
const body = document.querySelector('body')
if (headerBurger) {
    headerBurger.addEventListener ('click', () => {
        body.classList.toggle('burger')
    });
    headerBurgerLink.forEach((el) => {
        el.addEventListener('click', () => {
            body.classList.toggle('burger')
        })
    });
}


// Cart Simulator
let products = [
    {
        id: 1,
        name: 'Lorem ipsum dolor sit amet consectetur. Duis',
        code: 'L434-GH43',
        quantity: 1,
        pricePerOne: 220,
        imageName: 'product1.png'
    },
    {
        id: 2,
        name: 'Lorem ipsum dolor sit amet',
        code: 'L434-GH44',
        quantity: 2,
        pricePerOne: 250,
        imageName: 'product2.png'
    },
    {
        id: 3,
        name: 'Lorem ipsum dolor sit amet consectetur. Dictum venenatis porta at mus sit congue mi ultrices metus. Egestas varius morbi dictumst at egestas amet egestas. Lacus metus netus aliquet ac ipsum pulvinar amet.',
        code: 'L434-GH45',
        quantity: 3,
        pricePerOne: 180,
        imageName: 'product3.png',
        discount: true,
        pricePerOneAfterDiscount: 150
    },
]
const cartTableBody = document.querySelector('#cartTableBody')
const cartProductsQuantity = document.querySelector('#cartProductsQuantity')
const cartProductsPrice = document.querySelector('#cartProductsPrice')
const cartTotalPrice = document.querySelector('#cartTotalPrice')

if (cartTableBody) {
    cartTableBody.innerHTML = ''
    products.forEach(el => {
        let showPrice = ''
        if (el.discount && el.pricePerOneAfterDiscount) {
            showPrice = `
            <p class="cart-table__price cart-table__price--discount">
                ${el.pricePerOneAfterDiscount}c
                <span>${el.pricePerOne}c</span>
            </p>`
        } else {
            showPrice = `<p class="cart-table__price">${el.pricePerOne}c</p>`
        }

        cartTableBody.innerHTML += `
            <tr class="cart-table__product" data-id="${el.id}">
                <th scope="row">
                    <div class="cart-table__img">
                        <img src="images/${el.imageName}" alt="Продукт">
                    </div>
                </th>
                <td class="cart-table__padding-right">
                    <p class="cart-table__title">${el.name}</p>
                </td>
                <td class="cart-table__padding-left cart-table__padding-right">
                    <p class="cart-table__code">${el.code}</p>
                </td>
                <td class="cart-table__padding-left cart-table__padding-right">
                    <div class="product-counter">
                        <button type="button" class="product-counter__btn" data-type="minus">-</button>
                        <span class="product-counter__text">${el.quantity}</span>
                        <button type="button" class="product-counter__btn" data-type="plus">+</button>
                    </div>
                </td>
                <td class="cart-table__padding-left cart-table__price-wrap">
                    ${showPrice}
                </td>
                <td>
                    <button type="button" class="cart-table__btn-remove">
                        <img src="images/icons/crossIcon.svg" alt="Удалить">
                    </button>
                </td>
            </tr>
        `
    })
}

const cartTableProducts = cartTableBody.querySelectorAll('.cart-table__product')
if (cartTableProducts) {
    cartTableProducts.forEach(product => {
        const counterBtn = product.querySelectorAll('.product-counter__btn')
        const deleteBtn = product.querySelector('.cart-table__btn-remove')
        const productId = product.getAttribute('data-id')
        const productObject = products.filter(el => +el.id === +productId)[0]

        counterBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                const btnType = btn.getAttribute('data-type')
                countProduct(btnType, product, productObject)
            })
        })
        deleteBtn.addEventListener('click', () => {
            product.remove()
            products = products.filter(el => +el.id !== +productId)
            updateTotalPricesAndQuantities()
        })
    })
}

function countProduct(btnType, product, productObject) {
    const productQuantityWrap = product.querySelector('.product-counter__text')
    let productQuantity = productObject.quantity
    if (btnType === 'plus') {
        productQuantity++
    } else if (btnType === 'minus') {
        if (productQuantity <= 1) {
            product.remove()
            products = products.filter(el => +el.id !== +productObject.id)
        }
        productQuantity--
    }
    productQuantityWrap.innerText = productQuantity
    productObject.quantity = productQuantity
    updateTotalPricesAndQuantities()
}

function updateTotalPricesAndQuantities() {
    const totalPrice = products.reduce((acc,res) => {
        if (res.discount && res.pricePerOneAfterDiscount) {
            return res.pricePerOneAfterDiscount * res.quantity + acc
        } else {
            return res.pricePerOne * res.quantity + acc
        }
    }, 0)
    const totalQuantity = products.reduce((acc,res) => {
        return res.quantity + acc
    }, 0)

    cartProductsQuantity.innerText = totalQuantity + ''
    cartProductsPrice.innerText = totalPrice + 'c'
    cartTotalPrice.innerText = totalPrice + 'c'
}
updateTotalPricesAndQuantities()

// Products Search
$(document).ready(function () {
    let productsArray = []
    $.getJSON("products.json", function (data) {
        productsArray = [...data]
    });
    let timeout = null
    let secondTimeout = null
    $('.header-search__input').on('input focus', function() {
        if (productsArray.length > 0) {
            const filteredArray = productsArray.filter(el => el.name.toLowerCase().includes(this.value.toLowerCase()))

            if (this.value.length > 0) {
                $('.header-search__results').css('display', 'block')
                if (!timeout) {
                    timeout = setTimeout(() => {
                        $('.header-search__results').addClass('header-search__results--show')
                        timeout = null
                    },10)
                }
                $('.header-search__results').empty()
                if (filteredArray.length > 0) {
                    filteredArray.forEach(el => {
                        $('.header-search__results').append(`
                        <div class="header-search__results-item">
                        <div class="header-search__results-item__image">
                            <img src="images/${el.imageName}" alt="Продукт">
                        </div>
                        <a href="#" class="header-search__results-item__title">${el.name}</a>
                    </div>
                    `)
                    })
                } else {
                    $('.header-search__results').append(`<p>Ничего нет</p>`)
                }


            } else {
                $('.header-search__results').removeClass('header-search__results--show')
                if (!secondTimeout) {
                    secondTimeout = setTimeout(() => {
                        $('.header-search__results').css('display', 'none')
                    },500)
                }
            }
        }
    });

    $(document).on("click", function(event){
        if(!$(event.target).closest(".header-search").length){
            $('.header-search__results').removeClass('header-search__results--show')
            if (!secondTimeout) {
                secondTimeout = setTimeout(() => {
                    $('.header-search__results').css('display', 'none')
                },500)
            }
        }
        if(!$(event.target).closest(".header__burger").length && !$(event.target).closest(".header__wrapper-burger").length) {
            body.classList.remove('burger')
        }
    });

});



