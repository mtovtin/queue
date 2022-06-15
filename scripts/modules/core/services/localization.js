"use strict";

angular
    .module("core")
    .config(["tmhDynamicLocaleProvider", function (tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern("/scripts/webpreregistration/localization/angular-locale_{{locale}}.js");
    }])
    .provider("LocalizationService", [
        "$injector", function ($injector) {
            return {
                $get: [
                    "$rootScope", "tmhDynamicLocale", function ($rootScope, tmhDynamicLocale) {
                        var data = {
                            ua: {
                                "home.header": "Вас вітає Ужгородська міська рада!",
                                "home.preRegDescription": "Шановний відвідувачу, даний сервіс дозволяє Вам здійснити попередній запис на прийом до адміністратора центру надання адміністративних послуг та департаменту соціальної політики.",
                                "home.preRegExplanation": "Просимо врахувати, що попередній запис можна здійснити лише один раз на одну послугу протягом робочого дня і окремо на видачу документів. Після здійснення реєстрації, роздрукуйте інформацію про запис (номер в електронній черзі, дату, час прийому та назву послуги) та надайте його адміністратору під час обслуговування. Візьміть з собою паспорт та доручення (у разі представлення інтересів іншої особи). Рекомендуємо Вам завчасно прийти до центру надання адміністративних послуг або до департаменту соціальної політики та слідкувати за викликом на моніторах електронної черги.",
                                "home.preRegCautionAboutTime": "Зверніть увагу! Можливе зміщення часу прийому у зв\'язку із обслуговуванням адміністратором попереднього відвідувача!",
                                "home.completeTheProfile": "Заповнити анкету",
                                "profile.visitorProfile": "Анкета відвідувача",
                                "profile.firstName": "Ім\'я",
                                "profile.lastName": "Прізвище",
                                "profile.patronymic": "По батькові",
                                "profile.legalPersonName": "Назва юридичної особи",
                                "profile.phone": "Номер телефону",
                                "profile.email": "E-mail",
                                "profile.quantity": "Кількість осіб",
                                "profile.acceptTerms": "Відповідно до ст. 11 Закону України «Про захист персональних даних» надаю згоду на обробку та використання моїх даних для здійснення повноважень, пов\'язаних із розглядом данного запиту",
                                "profile.back": "Повернутися назад",
                                "profile.startPreRegistration": "Продовжити",
                                "queue.serviceCenter.preEntry": "Попередній запис",
                                "queue.serviceCenter.selectDepartment": "Будь ласка, оберіть підрозділ",
                                "queue.serviceCenter.back": "Повернутися назад",
                                "queue.service.preEntry": "Попередній запис",
                                "queue.service.selectService": "Будь ласка, оберіть необхідну послугу",
                                "queue.service.back": "Повернутися назад",
                                "queue.service.register": "Зареєструватись",
                                "queue.registerError": "На жаль, реєстрація неможлива, будь ласка оберіть іншу дату! Дякуємо",
                                "queue.service.selectTime": "Будь ласка, оберіть бажаний час візиту",
                                "queue.documentNumInput": "Введіть реєстраційний номер справи",
                                "queue.continue": "Продовжити",
                                "print.congratulationsOnSuccessfulRegistration": "Вітаємо з успішною реєстрацією на прийом до адміністратора Департаменту соціальної політики Ужгородської міської ради",
                                "print.onTheIssue": "з питання",
                                "print.in": "о",
                                "print.yourNumberInQueue": "Номер у черзі:",
                                "print.registrationTime": "Час:",
                                "print.registrationDate": "Дата прийому:",
                                "print.email": "Електронна скринька:",
                                "print.printReceipt": "Чек реєстрації",
                                "print.note": "Увага!",
                                "print.comeOnTime":"Просимо своєчасно прибути до центру, у разі запізнення Ваш чек буде анульовано!",
                                "print.mustPresentDocument": "При зверненні в ЦНАП необхідно представити документ, який засвідчує особу, та довіреність у разі представлення інтересів.",
                                "print.onlyOneRegistration":"Один запис у черзі надає можливість отримання тільки однієї послуги!",
                                "print.numberCantBeTransferred": "Запис до електронної черги є індивідуальним, передача запису третім особам не допускається!",
                                "print.end": "Завершити"
                            },
                            ru: {},
                            en: {}
                        };

                        var currentLanguage = "ua";
                        var availableLanguages = {
                            1: "ua",
                            2: "ru",
                            3: "en"
                        };

                        var translate = function (key) {
                            if (data[currentLanguage][key])
                                return data[currentLanguage][key];
                            else
                                return key;
                        };

                        var setLanguage = function (languageId) {
                            currentLanguage = availableLanguages[languageId] || "ua";

                            var languageName = availableLanguages[languageId];
                            if (languageName === "ua")
                                languageName = "uk";

                            tmhDynamicLocale.set(languageName);
                        }

                        $rootScope.L = translate;
                        setLanguage(1);

                        return {
                            getMessage: function (key) {
                                return translate(key);
                            },
                            setLanguage: setLanguage,
                            getCurrentLanguage: function () {
                                for (var languageKey in availableLanguages) {
                                    if (availableLanguages.hasOwnProperty(languageKey) && availableLanguages[languageKey] === currentLanguage) {
                                        return { id: languageKey, value: availableLanguages[languageKey] };
                                    }
                                }

                                return { id: 1, value: availableLanguages[1] };
                            }
                        }
                    }
                ]
            };
        }
    ]);