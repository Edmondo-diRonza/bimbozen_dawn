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
  wishlistData = wishlistData.filter((item) => item.productId !== productId);
  localStorage.setItem(list, JSON.stringify(wishlistData));
  // console.log(wishlistData);
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

  if (!wishlistButtons.length) {
    console.error('Element with class "wishlist_button" not found');
  }

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
    console.log("Both wishlists are empty");
    return;
  }

  const cardComponent = (item, localstorage = "wishlist") => {
    return `
        <div class="wishlist-product__list">
            <div class="c-product">
            <a href="${item.productUrl}">
                <img src="${item.productImg}" alt="${item.productTitle}">
                </a>
                <h3 class="c-product__title card__heading h5">
                    <a class="full-unstyled-link" href="${item.productUrl}">${item.productTitle}</a>
                </h3>
                <p>${item.productPrice}</p>
                <button onclick="removeFromWishlist('${item.productId}','${localstorage}' )">Remove</button>
            </div>
        </div>
      `;
  };

  // Funzione per generare l'HTML dalla wishlist
  const renderDom = (wishlist, localstorage = "wishlist") => {
    return wishlist.map((item) => cardComponent(item, localstorage)).join("");
  };

  // Seleziona il blocco di wishlist principale
  const wishlistBlock = document.querySelector(".js-wishlistBlock");
  const wishlistBlockIported = document.querySelector(
    ".js-wishlistBlockImported"
  );

  // Aggiungi la wishlist principale se ci sono dati
  if (wishlistData.length > 0) {
    if (wishlistBlock) {
      wishlistBlock.innerHTML = renderDom(wishlistData);
    } else {
      console.error('Element with class "js-wishlistBlock" not found');
    }
  }

  // Aggiungi la wishlist importata se ci sono dati
  if (wishlistDataImported.length > 0) {
    const importedList = document.getElementById("imported__list");
    if (importedList) {
      importedList.style.display = "block";
    } //visualizzo il titolo h2 della sezione
    if (wishlistBlock) {
      wishlistBlockIported.innerHTML = renderDom(
        wishlistDataImported,
        "wishlist_imported"
      );
    } else {
      console.error('Element with class "js-wishlistBlock" not found');
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

// Encode solo degli ID
const encodeWishlistIdFromLocalStorage = () => {
  // Recupera la wishlist dal localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist"));

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
    return `http://localhost:9292/?text=${encodedWishlist}`;
  } else {
    console.log("Nessuna wishlist salvata nel localStorage.");
    return null;
  }
};

// const decodeWishlistIdFromUrl = () => {
//   // Legge il parametro 'text' dall'URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const encodedText = urlParams.get("text");

//   // Verifica che esista un parametro 'text' nell'URL
//   if (encodedText) {
//     // Decodifica la stringa Base64 per ottenere gli ID dei prodotti
//     const decodedJsonString = atob(encodedText);

//     // Parsea la stringa JSON (array di productId)
//     const decodedProductIds = JSON.parse(decodedJsonString);
//     console.log("decoded", decodedProductIds);

//     // Crea un array per memorizzare la wishlist completa
//     const wishlistData = [];

//     // Per ogni productId, cerca il prodotto nel DOM per ottenere i dati mancanti
//     decodedProductIds.forEach((productId) => {
//       // Trova l'elemento del DOM corrispondente al productId
//       const productElement = document.querySelector(
//         `[data-product-id="${productId}"]`
//       );

//       if (productElement) {
//         // Estrai i dati mancanti dal DOM
//         const productTitle = productElement.getAttribute("data-product-title");
//         const productImg = productElement.getAttribute("data-product-img");
//         const productPrice = productElement.getAttribute("data-product-price");
//         const productUrl = productElement.getAttribute("data-product-url");

//         // Crea un oggetto con tutti i dati del prodotto
//         const productData = {
//           productTitle,
//           productImg,
//           productPrice,
//           productUrl,
//           productId,
//         };

//         // Aggiungi il prodotto alla wishlist
//         wishlistData.push(productData);
//       } else {
//         console.log(`Elemento con ID ${productId} non trovato nel DOM.`);
//       }
//     });

//     // Salva la nuova wishlist nel localStorage
//     localStorage.setItem("wishlist_imported", JSON.stringify(wishlistData));

//     console.log("Wishlist ripristinata nel localStorage.");
//   } else {
//     console.log("Nessun parametro 'text' trovato nell'URL.");
//   }
// };

const decodeWishlistIdFromUrl = (allProducts) => {
  console.log("14680010096963", allProducts);
  // Legge il parametro 'text' dall'URL
  const urlParams = new URLSearchParams(window.location.search);
  const encodedText = urlParams.get("text");

  // Verifica che esista un parametro 'text' nell'URL
  if (encodedText) {
    // Decodifica la stringa Base64 per ottenere gli ID dei prodotti
    const decodedJsonString = atob(encodedText);

    // Parsea la stringa JSON (array di productId)
    const decodedProductIds = JSON.parse(decodedJsonString);

    // Crea un array per memorizzare la wishlist completa
    const wishlistData = [];

    // Per ogni productId, cerca il prodotto nei dati disponibili in allProducts

    decodedProductIds.forEach((productId) => {
      // Trova il prodotto corrispondente nell'array allProducts
      const product = allProducts.find((p) => p.id == productId);

      let productData;

      if (product) {
        // Crea un oggetto con tutti i dati del prodotto
        productData = {
          productTitle: product.title,
          productImg: product.image,
          productPrice: product.price,
          productUrl: product.url,
          productId: product.id,
        };
      } else {
        console.log(`Prodotto con ID ${productId} non trovato in allProducts.`);
      }

      // Se sono stati trovati i dati, aggiungili alla wishlist
      if (productData) {
        wishlistData.push(productData);
      }

      // Salva la nuova wishlist nel localStorage quando tutti i dati sono stati recuperati
      if (wishlistData.length > 0) {
        localStorage.setItem("wishlist_imported", JSON.stringify(wishlistData));
        console.log("Wishlist ripristinata nel localStorage.");
      }
    });
  } else {
    console.log("Nessun parametro 'text' trovato nell'URL.");
  }
};
