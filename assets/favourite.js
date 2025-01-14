// attacca i listner su ogni cuore con classe .wishlist_button
const attachWishlistListeners = () => {
  document.querySelectorAll(".wishlist_button").forEach((card) => {
    card.addEventListener("click", (e) => {
      const productTitle = card.getAttribute("data-product-title");
      const productImg = card.getAttribute("data-product-img");
      const productPrice = card.getAttribute("data-product-price");
      const productUrl = card.getAttribute("data-product-url");
      const productId = card.getAttribute("data-product-id");
      toggleWishlist(
        productTitle,
        productImg,
        productPrice,
        productUrl,
        productId
      );
      favouriteRefresh(); // Aggiungo un refresh dei cuori perchè nella pagina potrebbero essere presenti altre card con lo stesso prodotto
    });
  });
};

// Aggiunge articoli alla wishlist
const toggleWishlist = (title, featured_image, price, url, id) => {
  let pdpData;

  pdpData = {
    productTitle: title,
    productImg: featured_image,
    productPrice: price,
    productUrl: url,
    productId: id,
  };

  let wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];
  const isAlreadyInWishlist = wishlistData.some(
    (item) => item.productTitle === pdpData.productTitle
  );
  let wishlistButton;
  if (id == undefined) {
    wishlistButton = document.getElementsByClassName("wishlist_button")[0];
  } else {
    wishlistButton = document.getElementById(id);
  }
  // nelle card usa l'id nella pagina prodotto usa la classe  wishlist_button

  if (!isAlreadyInWishlist) {
    wishlistData.push(pdpData);
    localStorage.setItem("wishlist", JSON.stringify(wishlistData));
    wishlistButton.innerHTML = getHeartFilledSVG(); //cuore pieno
  } else {
    wishlistData = wishlistData.filter(
      (item) => item.productTitle !== pdpData.productTitle
    );
    localStorage.setItem("wishlist", JSON.stringify(wishlistData));
    // alert('Product removed from wishlist:', pdpData.productTitle);
    wishlistButton.innerHTML = getHeartOutlineSVG(); //cuore vuoto
  }

  // Update the display after modifying the wishlist
  displayWishlist();
};

const removeFromWishlist = (productId, list = "wishlist") => {
  productId = productId;
  let wishlistData = JSON.parse(localStorage.getItem(list)) || [];
  console.log("array originale", wishlistData);
  wishlistData = wishlistData.filter((item) => item.productId !== productId);
  console.log("array elemento eliminato da salvare", wishlistData);
  localStorage.setItem(list, JSON.stringify(wishlistData));
  // if (wishlistData.length == 0) {
  //   console.log("La lista è vuota e devo far apparire la frase del cazzo");
  //   document.getElementById("wishlist__empty").style.display = "block";
  // }

  // Update the display after removing from the wishlist
  displayWishlist();
};

// funzione di favourite refresh
const favouriteRefresh = () => {
  // Fetch the wishlist data from localStorage
  const wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];
  // Seleziona tutti i pulsanti della wishlist
  const wishlistButtons = document.querySelectorAll(".wishlist_button");
  // Itera sui pulsanti e aggiorna lo stato in base alla wishlist
  wishlistButtons.forEach((node) => {
    const productTitle = node.getAttribute("data-product-title");
    const isFavorite = wishlistData.some(
      (item) => item.productTitle === productTitle
    );

    node.innerHTML = isFavorite ? getHeartFilledSVG() : getHeartOutlineSVG();
    node.classList.toggle("favorite", isFavorite);
  });
  // Display wishlist items
  displayWishlist();
};

// Display wishlist items mostra nella pagina dei preferiti cliccando sul cuore
const displayWishlist = () => {
  // Recupera i dati dalle localStorage
  const wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistDataImported =
    JSON.parse(localStorage.getItem("wishlist_imported")) || [];

  // Se non ci sono dati da renderizzare, esci dalla funzione
  if (wishlistData.length === 0 && wishlistDataImported.length === 0) {
    console.log("Entrambe le liste sono vuote");
  }
  console.log(
    "Rigenero lista preferiti, tramite funzione displayWishList ci sono: ",
    wishlistData.length,
    "elemento/i wishlist ed imported:",
    wishlistDataImported.length,
    "elemento/i"
  );
  //componente Card
  const cardComponent = (item, localstorage = "wishlist") => {
    return `
          <div class="card-wrapper product-card-wrapper underline-links-hover">
            <div class="!tw-relative card card--standard card--media" style="--ratio-percent: 100%;">
              <div class="card__inner color-scheme-89cf8fc1-b543-4c56-a924-ddd63f75d043 gradient ratio" style="--ratio-percent: 100%;">
                <div class="card__media">  
                  <div class="media media--transparent media--hover-effect" style="position:unset">
                    <img src="${item.productImg}" alt="${
      item.productTitle
    }" class="motion-reduce" loading="lazy">
                  </div>
                </div>
              </div>
              <div class="card__content !tw-bg-main/10 !tw-p-6">
                <div class="card__information tw-py-6">
                  <h3 class="card__heading h5">
                    <a class="tw-font-bold tw-text-2xl full-unstyled-link" href="${
                      item.productUrl
                    }">${item.productTitle}
                    </a>
                  </h3>                
                  <div class="card__information tw-py-4">
                    <span class="visually-hidden"> Produttore:</span>
                    <div class="caption-with-letter-spacing light">Vilac</div>
                    <span class="caption-large light"></span>
                    <div class="price">
                      <div class="price__container">
                        <div class="price__regular">
                          <span class="visually-hidden visually-hidden--inline">Prezzo di listino</span>
                          <span class="price-item price-item--regular">${
                            item.productPrice
                          }</span>
                        </div>                    
                      </div>
                    </div>
                  </div>
                </div>
                <div class="quick-add no-js-hidden">
                  <product-form data-section-id="template--24310269280579__featured_collection">
                    <form method="post" action="/cart/add" id="quick-add-template--24310269280579__featured_collection14672267247939" accept-charset="UTF-8" class="form" enctype="multipart/form-data" novalidate="novalidate" data-type="add-to-cart-form">
                      <input type="hidden" name="form_type" value="product">
                      <input type="hidden" name="utf8" value="✓">
                      <input type="hidden" name="id" value="51857429233987" class="product-variant-id">
                      <button id="quick-add-template--24310269280579__featured_collection14672267247939-submit" type="submit" name="add" class="cacca quick-add__submit button button--full-width button--secondary" aria-haspopup="dialog" aria-labelledby="quick-add-template--24310269280579__featured_collection14672267247939-submit title-template--24310269280579__featured_collection-14672267247939" aria-live="polite" data-sold-out-message="true">
                        <span class="tw-flex tw-items-center tw-gap-2 !tw-pb-6">Aggiungi al carrello 
                          <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 32 32">
                          <path fill="#3A3F4C" d="M4 7a1 1 0 0 0 0 2h2.22l2.624 10.5c.223.89 1.02 1.5 1.937 1.5h12.47c.903 0 1.67-.6 1.907-1.47L27.75 10h-2.094l-2.406 9H10.78L8.157 8.5A1.984 1.984 0 0 0 6.22 7zm18 14c-1.645 0-3 1.355-3 3s1.355 3 3 3s3-1.355 3-3s-1.355-3-3-3m-9 0c-1.645 0-3 1.355-3 3s1.355 3 3 3s3-1.355 3-3s-1.355-3-3-3m3-14v5h-3l4 4l4-4h-3V7zm-3 16c.564 0 1 .436 1 1s-.436 1-1 1s-1-.436-1-1s.436-1 1-1m9 0c.564 0 1 .436 1 1s-.436 1-1 1s-1-.436-1-1s.436-1 1-1"></path>
                          </svg>
                        </span>
                        <span class="hidden sold-out-message">
                          Esaurito
                        </span>
                        <div class="loading__spinner hidden">
                          <svg xmlns="http://www.w3.org/2000/svg" class="spinner" viewBox="0 0 66 66">
                          <circle stroke-width="6" cx="33" cy="33" r="30" fill="none" class="path"></circle>
                          </svg>
                        </div>
                      </button>
                      <input type="hidden" name="product-id" value="${
                        item.productId
                      }">
                      <input type="hidden" name="section-id" value="template--24310269280579__featured_collection">
                    </form>
                  </product-form>
                </div>
                <div class="wishlist__button  !tw-absolute !tw-top-2 !tw-right-2 !tw-z-[999999]" onclick="removeFromWishlist('${
                  item.productId
                }','${localstorage}' )">
                  <button class="wishlist_button" id='${
                    item.productId
                  }' data-product-title="${
      item.productTitle
    }" data-product-img="${item.productImg}" data-product-price="${
      item.productPrice
    }" data-product-url="${item.productUrl}" data-product-id="${
      item.productId
    }">
                    ${getHeartFilledSVG()}
                  </button>
                </div>             
              </div>              
            </div>               
          </div>           
    `;
  };

  // Funzione per generare l'HTML dalla wishlist che inietta le cardComponent
  const renderDom = (wishlist, localstorage = "wishlist") => {
    return wishlist.map((item) => cardComponent(item, localstorage)).join("");
  };

  // Seleziona i blocchi di wishlist standard ed importati
  const wishlistBlock = document.querySelector(".js-wishlistBlock");
  const wishlistBlockIported = document.querySelector(
    ".js-wishlistBlockImported"
  );

  // Aggiungi la wishlist principale se ci sono dati
  if (wishlistData.length > 0) {
    if (wishlistBlock) {
      wishlistBlock.innerHTML = renderDom(wishlistData);
      document.getElementById("favourite__share-div").style.display = "flex"; // accendo il div di share perchè sto renderizzando le card
      document.getElementById("favourite__share-div").style.flexDirection =
        "column"; // uso il flex col
      document.getElementById("wishlist__empty").style.display = "none"; // spengo il div di wishlist vuota
    } else {
      console.log('Non trovo la classe "js-wishlistBlock"'); // controllo che la classe dove iniettare html esista e che sono nei preferiti
    }
  } else {
    if (!!wishlistBlock) {
      wishlistBlock.innerHTML = "";
      document.getElementById("favourite__share-div").style.display = "none"; // spengo il div di share perchè non c'è più niente nei preferiti
      if (wishlistDataImported == 0) {
        document.getElementById("wishlist__empty").style.display = "block"; // faccio apparire il messaggio solo se emtrambe sono a 0 per questo faccio altro controllo su array wishlistDataImported perchè nella condizione principale controllo solo array preferiti principale
      }
    }
  }

  // Aggiungi la wishlist importata se ci sono dati
  if (wishlistDataImported.length > 0) {
    const importedList = document.getElementById("imported__list");
    if (importedList) {
      importedList.style.display = "block";
    } //visualizzo il titolo h2 della sezione della lista importata
    if (wishlistBlockIported) {
      wishlistBlockIported.innerHTML = renderDom(
        wishlistDataImported,
        "wishlist_imported"
      );
    } else {
      console.log('Element with class "js-wishlistBlock" not found');
    }
  } else {
    if (!!wishlistBlockIported) {
      wishlistBlockIported.innerHTML = "";
      document.getElementById("imported__list").style.display = "none"; // spengo imported_list
    }
  }
};

const getHeartFilledSVG = () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
	<path fill="#3A3F4C" fill-opacity="0" d="M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9c0 0 -7.43 -7.79 -8.24 -9c-0.48 -0.71 -0.76 -1.57 -0.76 -2.5c0 -2.49 2.01 -4.5 4.5 -4.5c1.56 0 2.87 0.84 3.74 2c0.76 1 0.76 1 0.76 1Z">
		<animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1" />
	</path>
	<path fill="none" stroke="#3A3F4C" stroke-dasharray="32" stroke-dashoffset="32" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9">
		<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.7s" values="32;0" />
	</path>
</svg>`;

const getHeartOutlineSVG = () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
	<path fill="#3A3F4C" d="M4.24 12.25a4.2 4.2 0 0 1-1.24-3A4.25 4.25 0 0 1 7.25 5c1.58 0 2.96.86 3.69 2.14h1.12A4.24 4.24 0 0 1 15.75 5A4.25 4.25 0 0 1 20 9.25c0 1.17-.5 2.25-1.24 3L11.5 19.5zm15.22.71C20.41 12 21 10.7 21 9.25A5.25 5.25 0 0 0 15.75 4c-1.75 0-3.3.85-4.25 2.17A5.22 5.22 0 0 0 7.25 4A5.25 5.25 0 0 0 2 9.25c0 1.45.59 2.75 1.54 3.71l7.96 7.96z" />
</svg>`;

// Encode degli ID memorizzati nel localstorage per poterli condivere con whatsapplinkshare
const encodeWishlistIdFromLocalStorage = () => {
  // Da cambiare per mettere in produzione
  const DOMAIN = "http://bimbozen.it/?text=";

  // Recupera la wishlist dal localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist"));
  if (wishlist.length == 0) {
    console.log("localstorage vuoto", wishlist.length);
    return null;
  }

  // Verifica che la wishlist esista
  if (wishlist) {
    // Estrai solo gli ID dei prodotti dalla wishlist
    const productIds = wishlist.map((item) => item.productId);

    // Serializza gli ID in una stringa JSON
    const jsonString = JSON.stringify(productIds);

    // Usa TextEncoder per codificare la stringa JSON in un array di byte (UTF-8)
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonString);

    // Converte l'array di byte in una stringa Base64
    const encodedWishlist = btoa(String.fromCharCode.apply(null, uint8Array));

    // Restituisci il link con gli ID dei prodotti codificati
    return DOMAIN + encodedWishlist;
  } else {
    console.log("Nessuna wishlist salvata nel localStorage.");
    return null;
  }
};

const decodeWishlistIdFromUrl = async () => {
  // Legge il parametro 'text' dall'URL
  const urlParams = new URLSearchParams(window.location.search);
  const encodedText = urlParams.get("text");

  // Verifica che esista un parametro 'text' nell'URL
  if (encodedText) {
    console.log("Inizio decodifica stringa...");

    // Decodifica la stringa Base64 per ottenere gli ID dei prodotti
    const decodedJsonString = atob(encodedText);

    // Parsea la stringa JSON (array di productId)
    const decodedProductIds = JSON.parse(decodedJsonString);
    console.log("Stringa ID decodificata", decodedProductIds);

    // Crea un array per memorizzare la wishlist completa
    const wishlistData = [];

    // Per ogni productId, cerca il prodotto nel DOM per ottenere i dati mancanti
    for (const productId of decodedProductIds) {
      // Trova l'elemento del DOM corrispondente al productId
      const productElement = document.querySelector(
        `[data-product-id="${productId}"]`
      );

      let productData;

      if (productElement) {
        // Estrai i dati mancanti dal DOM
        const productTitle = productElement.getAttribute("data-product-title");
        const productImg = productElement.getAttribute("data-product-img");
        const productPrice = productElement.getAttribute("data-product-price");
        const productUrl = productElement.getAttribute("data-product-url");

        // Crea un oggetto con tutti i dati del prodotto
        productData = {
          productTitle,
          productImg,
          productPrice,
          productUrl,
          productId,
        };

        console.log(
          `Prodotto con ID ${productId} trovato nel DOM, risparmierai una fetch!`
        );
      } else {
        console.log(
          `Spiacente: elemento con ID ${productId} non trovato nel DOM, recupero tramite fetch.`
        );

        // Se il prodotto non è nel DOM, fai una fetch per recuperarlo
        const fetchedProduct = await fetchProductById(productId);

        if (!!fetchedProduct) {
          productData = {
            productTitle: fetchedProduct.product.title,
            productImg: fetchedProduct.product.images.edges[0]?.node.url || "",
            productPrice:
              "€ " +
                fetchedProduct.product.variants.edges[0]?.node.price.amount.replace(
                  ".",
                  ","
                ) || "",
            productUrl: "/products/" + fetchedProduct.product?.handle || "",
            productId: fetchedProduct.product.id.slice(22),
          };
          console.log(
            "Questo prodotto è stato recuperato tramite fetch, sei stato comunque fortunato!",
            productData
          );
        } else {
          console.log(
            `Spiacente, il prodotto con ID ${productId} non trovato tramite fetch.`
          );
        }
      }

      // Se sono stati trovati i dati, aggiungili alla wishlist
      if (productData) {
        wishlistData.push(productData);
      }
    }

    // Salva la nuova wishlist nel localStorage quando tutti i dati sono stati recuperati
    if (wishlistData.length > 0) {
      localStorage.setItem("wishlist_imported", JSON.stringify(wishlistData));
      console.log("Ripristino della wishlist completato nel localStorage.");
    }
  }
};

// Fetch storefront API
const fetchProductById = async (productId) => {
  const storefrontEndpoint =
    "https://f3ba51-0b.myshopify.com/api/2023-01/graphql.json";
  const storefrontAccessToken = "5b0a84d5183c92794ac2e3f0ea343529";

  // Verifica se il productId è già un Global ID
  const isGlobalId = productId.startsWith("gid://shopify/Product/");
  const globalId = isGlobalId
    ? productId
    : btoa(`gid://shopify/Product/${productId}`);

  const query = `
    query getProductById($id: ID!) {
      product(id: $id) {
        id
        title
        descriptionHtml
        handle
        images(first: 5) {
          edges {
            node {
              altText
              url
            }
          }
        }
        variants(first: 5) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  //     product(id: $id) {
  //       id
  //       title
  //       descriptionHtml
  //       handle  // Aggiungi il campo handle
  //       images(first: 5) {
  //         edges {
  //           node {
  //             altText
  //             url
  //           }
  //         }
  //       }
  //       variants(first: 5) {
  //         edges {
  //           node {
  //             id
  //             title
  //             price {
  //               amount
  //               currencyCode
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // `;

  const variables = {
    id: globalId, // Passa il Global ID corretto
  };

  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  };

  try {
    const response = await fetch(storefrontEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    // Se ci sono errori nella risposta GraphQL, stampa e restituisci null
    if (errors) {
      console.error("GraphQL Errors:", errors);
      return null;
    }

    return data; // Restituisci i dati solo se non ci sono errori
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// condivisione di fallback
const whatsappLinkShare = () => {
  const wishlistLink = encodeWishlistIdFromLocalStorage();
  //controllo che il link esista
  if (!wishlistLink) {
    alert("La wishlist è vuota!");
    return;
  }
  // Testo da condividere
  const shareText = `Guarda la mia wishlist: ${wishlistLink}`;
  // Genera il link per WhatsApp
  const whatsappLink = `https://wa.me/?text=${shareText}`;
  // Apri il link su WhatsApp
  console.log(wishlistLink);
  window.open(whatsappLink, "_blank");
};
