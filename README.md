# RelatorioApp 📊

Um aplicativo mobile para controle de relatórios, metas e estudos, desenvolvido em **React Native** com Expo.

---

## ✨ Funcionalidades
- Cadastro e visualização de relatórios de atividades
- Definição de metas mensais e diárias
- Controle de dias de trabalho
- Backup e restauração de dados
- Compartilhamento de relatórios
- Interface moderna e responsiva

---

## 🚀 Instalação e Execução

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/relatorio-app-react-native.git
   cd relatorio-app-react-native
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   # ou
   yarn
   ```

3. **Execute em modo desenvolvimento:**
   ```sh
   npx expo start
   ```
   - Use o app Expo Go para testar no seu celular (Android/iOS)

---

## 📦 Build para Produção

### Android (APK/AAB)
```sh
npx eas build -p android --profile production
```

### iOS (IPA)
```sh
npx eas build -p ios --profile production
```

> Para builds de produção, configure as variáveis de ambiente e os perfis no `eas.json`.

---

## 🏪 Publicação

- **Google Play:** Siga o [guia oficial](https://docs.expo.dev/distribution/play-store/)
- **App Store (iOS):** Siga o [guia oficial](https://docs.expo.dev/distribution/app-stores/)

---

## 🖼️ Screenshots

<p align="center">
  <img src="./assets/screenshots/home.png" width="200" />
  <img src="./assets/screenshots/goals.png" width="200" />
  <img src="./assets/screenshots/report.png" width="200" />
</p>

---

## 🛠️ Tecnologias
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [react-native-confetti-cannon](https://github.com/Vydia/react-native-confetti-cannon)

---

## 👨‍💻 Autor
- [Humberto Machado](humbertomachado.com.br)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 