function getGiftCardBalance(giftCardCode, verbose = false) {
  // Costruisci l'URL per la chiamata AJAX, includendo entrambi i parametri giftCardCode e verbose
  const url = `https://middleware-bimbozen.vercel.app/api/gift-card?giftCardCode=${giftCardCode}&verbose=${verbose}`;

  // Funzione per formattare la data in italiano
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("it-IT", options).format(date);
  };

  // Funzione per formattare il numero come valuta in italiano (con virgola)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Mostra il saldo della gift card con la virgola come separatore decimale
        console.log(`Saldo della gift card: ${formatCurrency(data.balance)}`);
        // Mostra l'ID della gift card
        console.log(`ID della gift card: ${data.giftCardId}`);
        // Mostra la data di creazione in italiano
        console.log(`Data di creazione: ${formatDate(data.createdAt)}`);
        // Mostra la data di scadenza in italiano
        console.log(`Data di scadenza: ${formatDate(data.expiresOn)}`);
        // Mostra il valore iniziale formattato
        console.log(`Valore iniziale: ${formatCurrency(data.initialValue)}`);
        // Mostra la data di disabilitazione in italiano
        console.log(
          `Data di disabilitazione: ${
            data.disabledAt ? formatDate(data.disabledAt) : "Non disabilitata"
          }`
        );

        // Restituisci l'oggetto completo con tutte le informazioni
        return {
          success: data.success,
          balance: data.balance,
          currency: data.currency,
          giftCardId: data.giftCardId,
          createdAt: data.createdAt,
          expiresOn: data.expiresOn,
          initialValue: data.initialValue,
          disabledAt: data.disabledAt,
          logs: data.logs,
        };
      } else {
        // Gestisci il caso in cui la gift card non è trovata
        console.log(data.message);
        return null;
      }
    })
    .catch((error) => {
      console.error(
        "Errore durante la richiesta del saldo della gift card:",
        error
      );
      return null;
    });
}
