(function () {
  "use strict";

  // Инициализация платформы
  Lampa.Platform.tv();

  (function () {
    "use strict";

    function startPlugin() {
      // -------------------------------------------------------------------------
      // НАСТРОЙКИ СЕРВЕРА
      // Укажите здесь IP адрес вашего Node.js сервера.
      // Если запускаете Lampa в браузере на том же ПК, можно оставить localhost/127.0.0.1
      // Если на телевизоре - укажите локальный IP компьютера (например, http://192.168.1.X:803)
      // -------------------------------------------------------------------------
      var serverUrl = "http://127.0.0.1:803"; 

      // --- ПРОВЕРКА НА СБОРКУ УДАЛЕНА ---
      
      // HTML шаблон (QR код можно поменять на свой или удалить картинку, так как старый бот не актуален)
      var qrCodeHtml = '<div class="myBot" style="line-height: 1;color: #ffffff;font-family: &quot;SegoeUI&quot;, sans-serif;font-size: 1em;box-sizing: border-box;outline: none;user-select: none;display: flex;-webkit-box-align: start;align-items: flex-start;position: relative;background-color: rgba(255, 255, 255, 0.1);border-radius: 0.3em;margin: 1.5em 2em;"><div class="ad-server__text">Для создания токена перейдите на сервер: <br>' + serverUrl + '/create_user</div></div>';

      // Добавление компонента "Аккаунт" в настройки
      Lampa.SettingsApi.addComponent({
        component: "acc",
        name: "Аккаунт",
        icon: '<svg fill="#ffffff" width="256px" height="256px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M16 17.25c4.556 0 8.25-3.694 8.25-8.25s-3.694-8.25-8.25-8.25c-4.556 0-8.25 3.694-8.25 8.25v0c0.005 4.554 3.696 8.245 8.249 8.25h0.001zM16 3.25c3.176 0 5.75 2.574 5.75 5.75s-2.574 5.75-5.75 5.75c-3.176 0-5.75-2.574-5.75-5.75v0c0.004-3.174 2.576-5.746 5.75-5.75h0zM30.898 29.734c-1.554-6.904-7.633-11.984-14.899-11.984s-13.345 5.080-14.88 11.882l-0.019 0.102c-0.018 0.080-0.029 0.172-0.029 0.266 0 0.69 0.56 1.25 1.25 1.25 0.596 0 1.095-0.418 1.22-0.976l0.002-0.008c1.301-5.77 6.383-10.016 12.457-10.016s11.155 4.245 12.44 9.93l0.016 0.085c0.126 0.566 0.623 0.984 1.219 0.984h0c0 0 0 0 0 0 0.095 0 0.187-0.011 0.276-0.031l-0.008 0.002c0.567-0.125 0.984-0.623 0.984-1.219 0-0.095-0.011-0.187-0.031-0.276l0.002 0.008z"></path></svg>'
      });

      // Слушатель открытия настроек
      Lampa.Settings.listener.follow("open", function (e) {
        setTimeout(function () {
          $("div[data-component=interface]").before($("div[data-component=acc]"));
        }, 30);

        if (e.name == "acc") {
          $('div[data-name="acc_auth"]').before(qrCodeHtml);

          if (localStorage.getItem("token") !== null) {
            $('div[data-name="acc_auth"]').hide();
            
            var focusElement = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div:nth-child(5)");
            if(focusElement) Lampa.Controller.focus(focusElement);
            Lampa.Controller.toggle("settings_component");
          } else {
            $('div > span:contains("Аккаунт")').hide();
            $('.settings-param > div:contains("Выйти")').parent().hide();
          }
        }
      });

      // --- Параметры интерфейса ---
      Lampa.SettingsApi.addParam({
        component: "acc",
        param: { name: "acc_title_auth", type: "title" },
        field: { name: "Авторизация", description: "" }
      });

      // Поле ввода токена
      Lampa.SettingsApi.addParam({
        component: "acc",
        param: { name: "acc_auth", type: "input", values: "", placeholder: "Введите токен", default: "" },
        field: { name: "Выполнить вход", description: "" },
        onChange: function (token) {
          console.log("Введенный токен:", token);
          var xhr = new XMLHttpRequest();
          xhr.open("POST", serverUrl + "/checkToken", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var response = JSON.parse(xhr.responseText);
              if (response.userId) {
                localStorage.setItem("token", token);
                Lampa.Noty.show("Токен действителен");
                Lampa.Settings.update();
              } else {
                localStorage.removeItem("token");
                Lampa.Noty.show("Токен недействителен");
              }
            } else if (xhr.readyState === 4) {
              Lampa.Noty.show("Ошибка запроса к серверу");
            }
          };
          xhr.send(JSON.stringify({ token: token }));
        }
      });

      // Статус
      Lampa.SettingsApi.addParam({
        component: "acc",
        param: { name: "acc_status", type: "title" },
        field: {
          name: '<div class="settings-folder" style="padding:0!important"><div style="width:1.3em;height:1.3em;padding-right:.1em"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;"><path style="fill:#1E0478;" d="M334.975,0c95.414,0,173.046,77.632,173.046,173.046c0,95.426-77.632,173.046-173.046,173.046 c-21.224,0-41.843-3.771-61.415-11.224l-40.128,40.128c-2.358,2.358-5.574,3.695-8.916,3.695h-27.139v27.126 c0,6.974-5.65,12.611-12.611,12.611h-12.359v12.359c0,6.974-5.65,12.611-12.611,12.611h-30.833v30.884 c0,3.342-1.337,6.558-3.708,8.916l-25.146,25.108C97.753,510.676,94.55,512,91.208,512H16.59c-6.961,0-12.611-5.65-12.611-12.611 v-90.546c0-3.342,1.337-6.558,3.695-8.916l165.467-165.479c-7.44-19.572-11.211-40.191-11.211-61.402 C161.929,77.632,239.549,0,334.975,0z M482.8,173.046c0-81.504-66.32-147.824-147.824-147.824 c-81.516,0-147.824,66.32-147.824,147.824c0,20.644,4.162,40.607,12.371,59.334c2.131,4.843,0.958,10.303-2.522,13.872 c-0.038,0.038-0.063,0.076-0.101,0.113L29.2,414.064v22.788l138.089-138.089c4.439-4.426,11.615-4.426,16.054,0 c4.426,4.439,4.426,11.615,0,16.054L29.2,468.959v17.819h56.787l17.756-17.731v-38.261c0-6.961,5.65-12.611,12.611-12.611h30.833 v-12.359c0-6.961,5.65-12.611,12.611-12.611h12.359V366.08c0-6.974,5.65-12.611,12.611-12.611h34.528l42.347-42.36 c0.038-0.038,0.076-0.063,0.113-0.101c3.581-3.481,9.029-4.653,13.872-2.522c18.74,8.222,38.703,12.384,59.347,12.384 C416.479,320.87,482.8,254.562,482.8,173.046z"/><path style="fill:#9B8CCC;" d="M334.975,25.222c81.504,0,147.824,66.32,147.824,147.824c0,81.516-66.32,147.824-147.824,147.824 c-20.644,0-40.607-4.162-59.347-12.384c-4.843-2.131-10.29-0.958-13.872,2.522c-0.038,0.038-0.076,0.063-0.113,0.101l-42.347,42.36 h-34.528c-6.961,0-12.611,5.637-12.611,12.611v27.126h-12.359c-6.961,0-12.611,5.65-12.611,12.611v12.359h-30.833 c-6.961,0-12.611,5.65-12.611,12.611v38.261l-17.756,17.731H29.2v-17.819l154.142-154.142c4.426-4.439,4.426-11.615,0-16.054 c-4.439-4.426-11.615-4.426-16.054,0L29.2,436.852v-22.788l167.699-167.699c0.038-0.038,0.063-0.076,0.101-0.113 c3.481-3.569,4.653-9.029,2.522-13.872c-8.21-18.727-12.371-38.69-12.371-59.334C187.151,91.542,253.459,25.222,334.975,25.222z M434.866,120.383c0-26.041-21.186-47.24-47.228-47.24c-26.054,0-47.24,21.199-47.24,47.24s21.186,47.24,47.24,47.24 C413.68,167.623,434.866,146.424,434.866,120.383z"/><path style="fill:#1E0478;" d="M387.638,73.143c26.041,0,47.228,21.199,47.228,47.24s-21.186,47.24-47.228,47.24 c-26.054,0-47.24-21.199-47.24-47.24S361.584,73.143,387.638,73.143z M409.644,120.383c0-12.144-9.874-22.019-22.006-22.019 c-12.144,0-22.018,9.874-22.018,22.019s9.874,22.019,22.018,22.019C399.77,142.402,409.644,132.527,409.644,120.383z"/><path style="fill:#FFFFFF;" d="M387.638,98.365c12.132,0,22.006,9.874,22.006,22.019s-9.874,22.019-22.006,22.019 c-12.144,0-22.019-9.874-22.019-22.019S375.494,98.365,387.638,98.365z"/></svg></div><div style="font-size:1.1em"><div style="padding: 0.3em 0.3em; padding-top: 0;"><div style="background: #d99821; padding: 0.5em; border-radius: 0.4em;color: white;"><div style="line-height: 0.3;">Аккаунт подключен</div></div></div></div></div>',
          description: ""
        }
      });

      // Выход
      Lampa.SettingsApi.addParam({
        component: "acc",
        param: { name: "acc_exit", type: "static" },
        field: { name: "Выйти из аккаунта", description: "" },
        onRender: function (item) {
          item.on("hover:enter", function () {
            localStorage.removeItem("token");
            Lampa.Storage.set("acc_sync", false);
            Lampa.Settings.update();
          });
        }
      });

      // --- Секция Синхронизации ---
      Lampa.SettingsApi.addParam({
        component: "acc",
        param: { name: "acc_title_sync", type: "title" },
        field: { name: "Синхронизация", description: "" }
      });

      // Бэкап
      Lampa.SettingsApi.addParam({
        component: "acc",
        param: { name: "acc_backup", type: "static", default: "" },
        field: {
          name: Lampa.Lang.translate("settings_cub_backup"),
          description: "Бэкап всех настроек аккаунта с возможностью дальнейшего импорта на любом устройстве"
        },
        onRender: function (item) {
          item.on("hover:enter", function () {
            var token = localStorage.getItem("token");
            if (token) {
              Lampa.Select.show({
                title: Lampa.Lang.translate("settings_cub_backup"),
                items: [
                  { title: Lampa.Lang.translate("settings_cub_backup_export"), export: true, selected: true },
                  { title: Lampa.Lang.translate("settings_cub_backup_import"), import: true },
                  { title: Lampa.Lang.translate("cancel") }
                ],
                onSelect: function (selected) {
                  if (selected.export) {
                    Lampa.Select.show({
                      title: Lampa.Lang.translate("sure"),
                      items: [
                        { title: Lampa.Lang.translate("confirm"), export: true, selected: true },
                        { title: Lampa.Lang.translate("cancel") }
                      ],
                      onSelect: function (conf) {
                        if (conf.export) {
                          var url = serverUrl + "/lampa/backup/export?token=" + encodeURIComponent(token);
                          var file = new File([JSON.stringify(localStorage)], "backup.json", { type: "text/plain" });
                          var formData = new FormData();
                          formData.append("file", file);
                          $.ajax({
                            url: url,
                            type: "POST",
                            data: formData,
                            async: true,
                            cache: false,
                            contentType: false,
                            enctype: "multipart/form-data",
                            processData: false,
                            success: function (res) {
                              if (res.result) Lampa.Noty.show(Lampa.Lang.translate("account_export_secuses"));
                              else Lampa.Noty.show(Lampa.Lang.translate("account_export_fail"));
                            },
                            error: function () {
                              Lampa.Noty.show(Lampa.Lang.translate("account_export_fail"));
                            }
                          });
                        }
                        Lampa.Controller.toggle("settings_component");
                      },
                      onBack: function () {
                        Lampa.Controller.toggle("settings_component");
                      }
                    });
                  } else if (selected.import) {
                    var url = serverUrl + "/lampa/backup/import?token=" + encodeURIComponent(token);
                    $.ajax({
                      url: url,
                      type: "GET",
                      async: true,
                      cache: false,
                      contentType: false,
                      enctype: "application/x-www-form-urlencoded",
                      processData: false,
                      success: function (res) {
                        if (res.result) {
                          if (res.data) {
                            var data = Lampa.Arrays.decodeJson(res.data, {});
                            var keys = Lampa.Arrays.getKeys(data);
                            for (var key in data) {
                              localStorage.setItem(key, data[key]);
                            }
                            Lampa.Noty.show(Lampa.Lang.translate("account_import_secuses") + " - " + Lampa.Lang.translate("account_imported") + " (" + keys.length + ") - " + Lampa.Lang.translate("account_reload_after"));
                            setTimeout(function () {
                              window.location.reload();
                            }, 5000);
                          } else {
                            Lampa.Noty.show(Lampa.Lang.translate("nodata"));
                          }
                        } else {
                          Lampa.Noty.show(Lampa.Lang.translate("account_import_fail"));
                        }
                      },
                      error: function () {
                        Lampa.Noty.show(Lampa.Lang.translate("account_import_fail"));
                      }
                    });
                    Lampa.Controller.toggle("settings_component");
                  } else {
                    Lampa.Controller.toggle("settings_component");
                  }
                },
                onBack: function () {
                  Lampa.Controller.toggle("settings_component");
                }
              });
            } else {
              Lampa.Noty.show("Вы не зашли в аккаунт");
            }
          });
        }
      });

      // Переключатель синхронизации
      Lampa.SettingsApi.addParam({
        component: "acc",
        param: { name: "acc_sync", type: "trigger", default: false },
        field: { name: "Синхронизация данных", description: "Синхронизация ваших закладок, плагинов, таймкодов, историй просмотров и поиска между устройствами" },
        onChange: function (value) {
          if (value === "true") {
            var token = localStorage.getItem("token");
            if (token) {
              SyncEngine.loadDataFromServer(token).then(function (data) {
                if (data) {
                  SyncEngine.updateLocalStorage(data);
                  Lampa.Noty.show("Приложение будет перезапущено ...");
                  setTimeout(function () {
                    window.location.reload();
                  }, 3000);
                } else {
                  console.log("Не удалось загрузить данные для синхронизации");
                }
              }).catch(function (err) {
                console.log("Ошибка при загрузке данных:", err);
              });
            } else {
              Lampa.Noty.show("Вы не зашли в аккаунт");
              if (Lampa.Storage.field("acc_sync")) {
                Lampa.Storage.set("acc_sync", false);
                Lampa.Settings.update();
              }
            }
          }
        }
      });

      var syncKeys = ["torrents_view", "plugins", "favorite", "file_view", "search_history"];

      var SyncEngine = {
        timer: null,
        needsSync: false,
        isSyncSuccessful: false,
        handleStorageChange: function (event) {
          var key = event.name;
          if (syncKeys.indexOf(key) !== -1) {
            this.needsSync = true;
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(function () {
              if (this.needsSync && !blockSync) {
                var token = localStorage.getItem("token");
                if (token) {
                  this.startSync(token);
                }
                this.needsSync = false;
              }
              blockSync = null;
            }.bind(this), 500);
          }
        },
        startSync: function (token) {
          console.log("Запуск синхронизации...");
          this.isSyncSuccessful = false;
          this.sendDataToServer(token).then(function () {
            if (this.isSyncSuccessful) console.log("Синхронизация успешно завершена");
            else console.log("Ошибка: Данные для синхронизации отсутствуют");
            this.needsSync = false;
          }.bind(this)).catch(function (err) {
            console.log("Ошибка синхронизации:", err);
            this.needsSync = true;
          }.bind(this));
        },
        sendDataToServer: function (token) {
          var data = this.getSyncedData();
          var formData = new FormData();
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              formData.append(key, JSON.stringify(data[key]));
            }
          }
          formData.append("file", new Blob([JSON.stringify(data)], { type: "application/json" }));
          return this.makeHttpRequest("POST", serverUrl + "/lampa/sync?token=" + encodeURIComponent(token), formData).then(function (xhr) {
            if (xhr.status === 200) {
              this.isSyncSuccessful = true;
              return JSON.parse(xhr.responseText);
            } else {
              this.isSyncSuccessful = false;
              console.log("Ошибка при синхронизации: " + xhr.status);
            }
          }.bind(this));
        },
        getSyncedData: function () {
          return {
            torrents_view: Lampa.Storage.get("torrents_view", "[]"),
            plugins: Lampa.Storage.get("plugins", "[]"),
            favorite: Lampa.Storage.get("favorite", "{}"),
            file_view: Lampa.Storage.get("file_view", "{}"),
            search_history: Lampa.Storage.get("search_history", "[]")
          };
        },
        loadDataFromServer: function (token) {
          return this.makeHttpRequest("GET", serverUrl + "/lampa/sync?token=" + encodeURIComponent(token)).then(function (xhr) {
            if (xhr.status === 200) return JSON.parse(xhr.responseText);
            else console.log("Ошибка при загрузке данных: " + xhr.status);
          }).then(function (res) {
            return res.success && res.data ? res.data : (console.log("Ошибка: Данные отсутствуют"), null);
          });
        },
        makeHttpRequest: function (method, url, body) {
          return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            if (method === "POST") xhr.send(body);
            else xhr.send();
            xhr.onload = function () {
              if (xhr.status >= 200 && xhr.status < 300) resolve(xhr);
              else reject(xhr);
            };
            xhr.onerror = function () { reject(xhr); };
          });
        },
        updateLocalStorage: function (serverData) {
          if (!serverData || typeof serverData !== "object") return;
          var keys = ["torrents_view", "plugins", "favorite", "file_view", "search_history"];
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (serverData.hasOwnProperty(key)) {
              if (key === "plugins") {
                // Логика объединения плагинов
                var localPlugins = Lampa.Storage.get("plugins") || [];
                for (var j = 0; j < serverData[key].length; j++) {
                  var serverPlugin = serverData[key][j];
                  var exists = localPlugins.find(function (p) { return p.url === serverPlugin.url; });
                  if (!exists) {
                    localPlugins.push({
                      name: serverPlugin.name || "Без названия",
                      url: serverPlugin.url,
                      status: typeof serverPlugin.status === "number" ? serverPlugin.status : 1,
                      author: serverPlugin.author || "@bylampa"
                    });
                    if (serverPlugin.status === 1) {
                      var script = document.createElement("script");
                      script.src = serverPlugin.url;
                      document.getElementsByTagName("head")[0].appendChild(script);
                    }
                  } else {
                    if (typeof serverPlugin.status === "number") {
                      if (serverPlugin.status === 1 && exists.status !== 1) {
                        var script = document.createElement("script");
                        script.src = serverPlugin.url;
                        document.getElementsByTagName("head")[0].appendChild(script);
                      }
                      exists.status = serverPlugin.status;
                    }
                  }
                }
                Lampa.Storage.set("plugins", localPlugins);
                
                // Удаление плагинов, которых нет на сервере
                localPlugins = Lampa.Storage.get("plugins") || [];
                var pluginsToRemove = localPlugins.filter(function (lp) {
                  return !serverData[key].find(function (sp) { return sp.url === lp.url; });
                });
                pluginsToRemove.forEach(function (plugin) {
                  var scriptTag = document.querySelector('script[src="' + plugin.url + '"]');
                  if (scriptTag) scriptTag.parentNode.removeChild(scriptTag);
                  var index = localPlugins.indexOf(plugin);
                  if (index !== -1) localPlugins.splice(index, 1);
                  Lampa.Storage.set("plugins", localPlugins);
                });
              } else if (key === "favorite") {
                Lampa.Storage.set("favorite", serverData[key]);
                Lampa.Favorite.init();
                Lampa.Favorite.read(true);
              } else if (key === "file_view") {
                Lampa.Storage.set("file_view", serverData[key]);
                Lampa.Timeline.read();
              } else {
                Lampa.Storage.set(key, serverData[key]);
              }
            }
          }
        }
      };

      Lampa.Storage.listener.follow("change", function (event) {
        if (Lampa.Storage.field("acc_sync")) SyncEngine.handleStorageChange(event);
      });

      var blockSync = setInterval(function () {
        if (typeof Lampa !== "undefined") {
          clearInterval(blockSync);
          var token = localStorage.getItem("token");
          var syncEnabled = Lampa.Storage.get("acc_sync", false);

          if (token && syncEnabled) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", serverUrl + "/checkToken", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  var res = JSON.parse(xhr.responseText);
                  if (res.userId) {
                    console.log("Токен действителен");
                    SyncEngine.loadDataFromServer(token).then(function (data) {
                      if (data) {
                        SyncEngine.updateLocalStorage(data);
                        blockSync = true;
                      }
                    });
                  } else {
                    localStorage.removeItem("token");
                    Lampa.Storage.set("acc_sync", false);
                    Lampa.Noty.show("Токен недействителен");
                  }
                }
              }
            };
            xhr.send(JSON.stringify({ token: token }));
          }
        }
      }, 200);

      Lampa.SettingsApi.addParam({
        component: "acc",
        param: { name: "sync_reset", type: "static" },
        field: { name: "Сброс данных синхронизации", description: "Данные будут удалены" },
        onRender: function (item) {
          item.on("hover:enter", function () {
            var token = localStorage.getItem("token");
            if (token) {
              var xhr = new XMLHttpRequest();
              xhr.open("DELETE", serverUrl + "/lampa/sync?token=" + encodeURIComponent(token));
              xhr.onload = function () {
                if (xhr.status === 200) Lampa.Noty.show("Данные удалены");
                else Lampa.Noty.show("Ошибка удаления");
              };
              xhr.send();
            } else {
              Lampa.Noty.show("Вы не зашли в аккаунт");
            }
          });
        }
      });
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow("app", function (e) { if (e.type == "ready") startPlugin(); });
  }());
}());
