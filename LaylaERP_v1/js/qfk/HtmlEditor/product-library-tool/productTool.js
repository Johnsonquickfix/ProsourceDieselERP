var editorTemplate =
    '<button id="addProduct" class="button">Add Product</button>';

var productItemsTemplate = _.template(`
<% _.forEach(products, function(item) { %>
  <div class="product-item" id="product-item" data-uuid='<%= item.id %>' data-title="<%= item.title %>" data-price="<%= item.price %>" data-image="<%= item.image %>" data-description="<%= item.description %>" >
  <img src="<%= item.image %>" style="max-height: 120px;min-height: 80px;width: 100%;" />
    <h4 style="margin: 8px 0; text-align: left;"><%= item.title %></h4>
    <h4 style="margin: 8px 0; text-align: left;">$<%= item.price %></h4>
    <p style="text-align: left;"><%= item.description %></p>
  </div>
<% }); %>
`);

var modalTemplate = function (data) {
    return `
  <div class="modal" id="product_library_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Products Library</h3>
          <button class="close" id="modalCloseBtn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="search-box">
            <input type="text" class="form-control" placeholder="Search by name" id="search-bar" style="width: 78%" />
            <button id="search-btn" class="button" style="width: 20%">Search</button>
          </div>
          <div class="products-list">
            ${productItemsTemplate(data)}
          </div>
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>
  </div>
`;
};

var toolTemplate = function (values, isViewer = false) {
    return `<div class="product-card" style="position:relative;display:table;min-width:0;word-wrap:break-word;background-color:#fff;background-clip:border-box;border:1px solid rgba(0,0,0,.125);border-radius:4px;margin:auto;text-align:center;">
    <img src="${values.productImage.url
        }" style="width: 100%; object-fit: contain; border-top-left-radius: 4px; border-top-right-radius: 4px;" />
    <div class="product-card-body" style="padding: 0 16px 16px;text-align: left;">
      <h3 style="margin: 12px 0; color: ${values.productTitleColor};">${values.productTitle
        }</h3>
      <div class="description">${values.productDescription}</div>
    </div>
    <div class="product-footer" style="display: flex; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top: 1px solid rgba(0,0,0,.125); align-items: center; font-weight: bold; background-color: ${values.productPriceBackgroundColor
        };">
      <div style="width: 50%; padding: 12px; font-size: 16px; line-height: 1.5; border-bottom-left-radius: 4px; color: ${values.productPriceColor
        };">$${values.productPrice}</div>
      <a class="button no-underline no-border-radius" href="${values.productCTAAction.url
        }" target="${values.productCTAAction.target
        }" style="width: 50%; text-decoration: none; border-bottom-right-radius: 4px; background-color: ${values.productCTAColor
        }; color: ${values.productCTATextColor
        }; display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; border: 1px solid transparent; padding: 12px; font-size: 16px; line-height: 1.5; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; cursor: pointer;">${values.productCTA
        }</a>
    </div>
  </div>
  ${isViewer ? modalTemplate({ products: values.data.products }) : ''}`;
};

var toolEmailTemplate = function (values, isViewer = false) {
    return `
    <table cellspacing="0" cellpadding="0" style="position:relative;min-width:0;word-wrap:break-word;background-color:#fff;background-clip:border-box;border:1px solid rgba(0,0,0,.125);border-radius:4px;margin:auto;text-align:center;">
      <tbody>
        <tr><td width="100%"><img src="${values.productImage.url}" style="width: 100%; object-fit: contain; border-top-left-radius: 4px; border-top-right-radius: 4px;" /></td></tr>
        <tr><td width="100%"><h3 style="text-align: left;margin: 8px 0 12px 0; padding: 0 16px; color: ${values.productTitleColor};">${values.productTitle}</h3></td></tr>
        <tr><td width="100%"><div class="description" style="text-align: left;padding: 0 16px; margin: 0 0 12px 0">${values.productDescription}</div></td></tr>
        <tr>
          <td width="100%">
            <table width="100%" cellspacing="0" cellpadding="0" style="border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top: 1px solid rgba(0,0,0,.125); align-items: center; font-weight: bold; background-color: ${values.productPriceBackgroundColor};">
              <tbody>
                <tr>
                  <td width="240px" style="text-align: center; padding: 12px; font-size: 16px; line-height: 1.5; border-bottom-left-radius: 4px;"><div style="color: ${values.productPriceColor};">$${values.productPrice}</div></td>
                  <td width="50%" style="border-bottom-right-radius: 4px; background-color: ${values.productCTAColor}; color: ${values.productCTATextColor}; font-weight: 400; text-align: center; vertical-align: middle; padding: 12px 0px; font-size: 16px; line-height: 1.5;"><a href="${values.productCTAAction.url}" target="${values.productCTAAction.target}" style="width: 100%; color: #fff;">${values.productCTA}</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  `;
};

var showModal = function () {
    var modal = document.getElementById('product_library_modal');
    modal.classList.add('show');
};

var hideModal = function () {
    var modal = document.getElementById('product_library_modal');
    modal.classList.remove('show');
};

unlayer.registerPropertyEditor({
    name: 'product_library',
    layout: 'bottom',
    Widget: unlayer.createWidget({
        render(value, updateValue, data) {
            return editorTemplate;
        },
        mount(node, value, updateValue, data) {
            var addButton = node.querySelector('#addProduct');
            addButton.onclick = function () {
                showModal();
                setTimeout(() => {
                    // We are using event bubling to capture clicked item instead of registering click event on all product items.
                    var selectButton = document.querySelector('.products-list');
                    if (!selectButton) return;
                    selectButton.onclick = function (e) {
                        if (e.target.id === 'product-item') {
                            // If user clicks on product item
                            // Find selected item from products list
                            const selectedProduct = data.products.find(
                                (item) => item.id === parseInt(e.target.dataset.uuid)
                            );
                            updateValue({ selected: selectedProduct });
                        } else {
                            // If user click on child of product item (e.g. title, price, image or desctiption)
                            const parent = e.target.parentElement;
                            if (parent && parent.id !== 'product-item') return;
                            const selectedProduct = data.products.find(
                                (item) => item.id === parseInt(parent.dataset.uuid)
                            );
                            updateValue({ selected: selectedProduct });
                        }
                        hideModal();
                        // This is a hack to close property editor right bar on selecting an item from products list.
                        var outerBody = document.querySelector('#u_body');
                        outerBody.click();
                    };
                    /* Register event listeners for search */
                    var searchBar = document.querySelector('#search-bar');
                    var searchButton = document.querySelector('#search-btn');
                    var closeBtn = document.querySelector('#modalCloseBtn');
                    searchButton.onclick = function (e) {
                        const list = document.querySelector(
                            '#product_library_modal .products-list'
                        );
                        let filteredItem;
                        let productsListHtml;
                        if (list && data && data.products) {
                            if (searchBar.value === '') {
                                productsListHtml = productItemsTemplate({
                                    products: data.products,
                                });
                            } else {
                                filteredItem = data.products.filter((item) =>
                                    item.title
                                        .toLowerCase()
                                        .includes(searchBar.value.toLowerCase())
                                );
                                productsListHtml = productItemsTemplate({
                                    products: filteredItem,
                                });
                            }
                            list.innerHTML = productsListHtml;
                        }
                    };
                    closeBtn.onclick = hideModal;
                }, 200);
            };
        },
    }),
});

unlayer.registerTool({
    name: 'product_tool',
    label: 'Product',
    icon: 'fa-tag',
    supportedDisplayModes: ['web', 'email'],
    options: {
        productContent: {
            title: 'Product Content',
            position: 1,
            options: {
                productLibrary: {
                    label: 'Add Product from store',
                    defaultValue: '',
                    widget: 'product_library',
                },
                productImage: {
                    label: 'Product Image',
                    defaultValue: { url: 'https://via.placeholder.com/150', },
                    widget: 'image',
                },
                productTitle: {
                    label: 'Product Title',
                    defaultValue: 'Product Title',
                    widget: 'text',
                },
                productTitleColor: {
                    label: 'Product Title Color',
                    defaultValue: '#000000',
                    widget: 'color_picker',
                },
                productDescription: {
                    label: 'Product Description',
                    defaultValue: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
                    widget: 'rich_text',
                },
                productPrice: {
                    label: 'Product Price',
                    defaultValue: '0.00',
                    widget: 'text',
                },
                productPriceColor: {
                    label: 'Product Price Color',
                    defaultValue: '#000000',
                    widget: 'color_picker',
                },
                productPriceBackgroundColor: {
                    label: 'Product Price Background',
                    defaultValue: '#ffffff',
                    widget: 'color_picker',
                },
                productCTA: {
                    label: 'Button Name',
                    defaultValue: 'Buy Now',
                    widget: 'text',
                },
                productCTAColor: {
                    label: 'Button Color',
                    defaultValue: '#007bff',
                    widget: 'color_picker',
                },
                productCTATextColor: {
                    label: 'Button Text Color',
                    defaultValue: '#ffffff',
                    widget: 'color_picker',
                },
                productCTAAction: {
                    label: 'Action Type',
                    defaultValue: {
                        name: 'web',
                        values: { href: 'http://google.com', target: '_blank', },
                    },
                    widget: 'link',
                },
            },
        },
    },
    transformer: (values, source) => {
        const { name, value, data } = source;
        // Transform the values here
        // We will update selected values in property editor here
        let newValues =
            name === 'productLibrary'
                ? {
                    ...values,
                    productTitle: value.selected.title,
                    productPrice: value.selected.price,
                    productDescription: value.selected.description,
                    productImage: {
                        url: value.selected.image,
                    },
                }
                : {
                    ...values,
                };

        // Return updated values
        return newValues;
    },
    values: {},
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                return toolTemplate(values, true);
            },
        }),
        exporters: {
            web: function (values) {
                return toolTemplate(values);
            },
            email: function (values) {
                return toolEmailTemplate(values);
            },
        },
        head: {
            css: function (values) { },
            js: function (values) { },
        },
    },
});
