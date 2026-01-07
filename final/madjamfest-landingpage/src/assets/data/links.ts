export const contactInfo = [
  "email@email.com",
  "MAD Jam Fest",
  "Escola Superior de Media Artes e Design",
  "Rua D.Sancho I",
];

export const menuLinks = ["Home", "Programa", "Open Calls", "Contacto"];

export const legalLinks = [
  "Política de Privacidade",
  "Termos de Utilização",
  "Política de Cookies",
];

export const navigationLinks = [
  {
    text: "PROGRAMA",
    className:
      "[font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-foreground",
    url: "/programa.pdf",
    type: "pdf" as const,
  },
  {
    text: "CONTACTO",
    className:
      "[font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-foreground",
    url: "https://linktr.ee/madjamfest",
    type: "external" as const,
  },
  {
    text: "OPEN CALLS",
    className:
      "[font-family:'Neue_Montreal-Italic',Helvetica] font-normal italic text-primary",
    url: "https://forms.gle/sNSF1cgyAFxbW3vu6",
    type: "external" as const,
  },
];