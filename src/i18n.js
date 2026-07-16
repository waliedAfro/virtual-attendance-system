import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// translations
import topNavEN from "./local/en/topNav.json";
import topNavAR from "./local/ar/topNav.json";

import dashboardEN from "./local/en/dashboard.json";
import dashboardAR from "./local/ar/dashboard.json";

import sideMenuEN from "./local/en/sideMenu.json";
import sideMenuAR from "./local/ar/sideMenu.json";

import companyEN from "./local/en/company.json" ; 
import companyAR from "./local/ar/company.json" ;

import subscriptionEN from "./local/en/subscription.json"; 
import subscriptionAR from "./local/ar/subscription.json";

import invoiceEn from "./local/en/invoice.json" ; 
import invoiceAR from "./local/ar/invoice.json" ;

import paymentEN from "./local/en/payment.json";
import paymentAR from "./local/ar/payment.json" ; 

import deviceEN from "./local/en/device.json" ; 
import deviceAR from "./local/ar/device.json" ; 

import locationEN from "./local/en/location.json" ; 
import locationAR from "./local/ar/location.json" ; 

import employeeEN from "./local/en/employee.json" ; 
import employeeAR from "./local/ar/employee.json" ; 

import shiftEN from "./local/en/shift.json" ;
import shiftAR from "./local/ar/shift.json";

import departmentEN from "./local/en/department.json" ;
import departmentAR from "./local/ar/department.json" ; 

import reportEN from "./local/en/report.json" ; 
import reportAR from "./local/ar/report.json" ;

import rbacEN from "./local/en/rbac.json" ; 
import rbacAR from "./local/ar/rbac.json" ;


const savedLanguage = localStorage.getItem("language") || "en";

// RTL languages list (scalable)
const RTL_LANGS = ["ar"];

// central direction handler
const setDirection = (lng) => {
  const dir = RTL_LANGS.includes(lng) ? "rtl" : "ltr";

  document.documentElement.setAttribute("lang", lng);
  document.documentElement.setAttribute("dir", dir);

  document.body.classList.remove("rtl", "ltr");
  document.body.classList.add(dir);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        topNav: topNavEN,
        dashboard: dashboardEN,
        sideMenu: sideMenuEN,
        company : companyEN ,
        subscription : subscriptionEN ,
        invoice : invoiceEn ,
        payment : paymentEN ,
        device : deviceEN ,
        location : locationEN ,
        employee : employeeEN ,
        shift : shiftEN, 
        department : departmentEN ,
        report : reportEN ,
        rbac : rbacEN ,
      },
      ar: {
        topNav: topNavAR,
        dashboard: dashboardAR,
        sideMenu: sideMenuAR,
        company : companyAR ,
        subscription : subscriptionAR,
        invoice : invoiceAR , 
        payment : paymentAR , 
        device : deviceAR ,
        location : locationAR , 
        employee : employeeAR , 
        shift : shiftAR ,
        department : departmentAR,
        report : reportAR,
        rbac : rbacAR
        
      },
    },

    lng: savedLanguage,
    fallbackLng: "en",

    defaultNS: "topNav",
    ns: ["topNav", "dashboard"],

    interpolation: {
      escapeValue: false,
    },
  });

// 🔥 single source of truth for language switching
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  setDirection(lng);
});

// 🔥 apply direction on first load immediately
setDirection(savedLanguage);

export default i18n;
