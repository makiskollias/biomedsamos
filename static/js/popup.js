const promoPopup = document.querySelector("#promoPopup");
const promoClose = document.querySelector("#promoClose");
const promoCta = document.querySelector("#promoCta");

if (promoPopup && promoClose) {
  setTimeout(() => {
  promoPopup.classList.add("is-visible");
}, 1200);
  promoClose.addEventListener("click", () => {
    promoPopup.classList.remove("is-visible");
  });

  promoCta?.addEventListener("click", () => {
    promoPopup.classList.remove("is-visible");
    umami?.track("mothers_day_offer_click");
  });
}