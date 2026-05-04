const promoPopup = document.querySelector("#promoPopup");
const promoClose = document.querySelector("#promoClose");

if (promoPopup && promoClose) {
  const now = new Date();

  // 👉 ΒΑΖΕΙΣ ΗΜΕΡΟΜΗΝΙΑ ΛΗΞΗΣ
  const expiryDate = new Date("2026-05-31");

  if (now <= expiryDate) {
    setTimeout(() => {
      promoPopup.classList.add("is-visible");
    }, 1200);
  }

  promoClose.addEventListener("click", () => {
    promoPopup.classList.remove("is-visible");
  });
}