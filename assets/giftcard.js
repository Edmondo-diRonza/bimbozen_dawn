const fetchGiftCardBalance = async (giftCardCode, verbose = false) => {
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

  try {
    // Esegui la fetch per ottenere i dati
    const response = await fetch(url, {
      method: "GET", // Specifica il metodo (facoltativo, GET è predefinito)
      mode: "cors", // Abilita CORS
      headers: {
        "Content-Type": "application/json", // Facoltativo, dipende dall'API
      },
    });
    // Usa await per aspettare la risposta
    const data = await response.json(); // Usa await per analizzare la risposta JSON

    if (data.success) {
      // Mostra i dati nella console
      console.log(`Saldo della gift card: ${formatCurrency(data.balance)}`);
      console.log(`ID della gift card: ${data.giftCardId}`);
      console.log(`Data di creazione: ${formatDate(data.createdAt)}`);
      console.log(`Data di scadenza: ${formatDate(data.expiresOn)}`);
      console.log(`Valore iniziale: ${formatCurrency(data.initialValue)}`);
      console.log(
        `Data di disabilitazione: ${
          data.disabledAt ? formatDate(data.disabledAt) : "Non disabilitata"
        }`
      );

      // Restituisci l'oggetto completo con tutte le informazioni
      return {
        success: data.success,
        balance: formatCurrency(data.balance),
        currency: formatCurrency(data.currency),
        giftCardId: data.giftCardId,
        createdAt: formatDate(data.createdAt),
        expiresOn: formatDate(data.expiresOn),
        initialValue: formatCurrency(data.initialValue),
        disabledAt: data.disabledAt
          ? formatDate(data.disabledAt)
          : "Non disabilitata",
      };
    } else {
      console.log(data.message);
      return null;
    }
  } catch (error) {
    console.error(
      "Errore durante la richiesta del saldo della gift card:",
      error
    );
    return null;
  }
};

// Funzione per mostrare i risultati nel DOM
const displayGiftCardResults = (result, resultContainer) => {
  // Verifica il risultato e se la proprietà success è vera
  if (result && result.success) {
    resultContainer.innerHTML = `
      <p><strong>Saldo:</strong> ${result.balance}</p>
      <p><strong>ID Gift Card:</strong> ${result.giftCardId}</p>
      <p><strong>Data di Creazione:</strong> ${result.createdAt}</p>
      <p><strong>Data di Scadenza:</strong> ${result.expiresOn}</p>
      <p><strong>Valore Iniziale:</strong> ${result.initialValue}</p>
      <p><strong>Data di Disabilitazione:</strong> ${
        result.disabledAt || "Non disabilitata"
      }</p>
    `;
  } else {
    // Gestione caso di errore se result o result.success sono falsi
    resultContainer.innerHTML = `<p><strong>Errore:</strong> card non trovata</p>`;
  }
};

// Funzione per formattare l'ID con uno spazio ogni 4 caratteri
function formatGiftCardCode(input) {
  // Rimuove tutto tranne i caratteri alfanumerici e converte tutto in maiuscolo
  let cleaned = input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  // Limita la lunghezza a 16 caratteri alfanumerici (così la lunghezza totale sarà 19 con gli spazi)
  if (cleaned.length > 16) {
    cleaned = cleaned.slice(0, 16);
  }

  // Aggiungi uno spazio ogni 4 caratteri
  let formatted = "";
  for (let i = 0; i < cleaned.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += " "; // Aggiungi uno spazio ogni 4 caratteri
    }
    formatted += cleaned[i];
  }

  return formatted;
}

// Funzione di validazione per controllare se l'ID è corretto
function validateGiftCardCode(id) {
  // Rimuove gli spazi e verifica che l'ID abbia 16 caratteri alfanumerici e 3 spazi
  const cleanedId = id.replace(/ /g, ""); // Rimuove gli spazi
  return cleanedId.length === 16 && id.split(" ").length === 4; // 16 caratteri alfanumerici e 3 spazi
}
