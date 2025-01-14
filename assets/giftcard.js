//middleware-bimbozen.vercel.app/

function getGiftCardBalance(giftCardCode) {
  // Chiamata AJAX al backend Express che interroga Shopify via GraphQL
  fetch(`https://middleware-bimbozen.vercel.app/api/gift-card/${giftCardCode}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Mostra il saldo della gift card
        console.log(`Saldo della gift card: ${data.balance} ${data.currency}`);
      } else {
        // Gestisci il caso in cui la gift card non è trovata
        console.log(data.message);
      }
    })
    .catch((error) => {
      console.error(
        "Errore durante la richiesta del saldo della gift card:",
        error
      );
    });
}

// Esempio di utilizzo: chiama la funzione passando il codice della gift card
// getGiftCardBalance("681182363971");
