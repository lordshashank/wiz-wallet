<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/lordshashank/wiz-wallet">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Wiz-Wallet</h3>

  <p align="center">
    Easing mina transactions
    <br />
    <a href="https://github.com/lordshashank/wiz-wallet"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/lordshashank/wiz-wallet">View Demo</a>
    ·
    <a href="https://github.com/lordshashank/wiz-wallet/issues">Report Bug</a>
    ·
    <a href="https://github.com/lordshashank/wiz-wallet/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Wiz-Wallet is a type of smart contract wallet that minimses the on-chain transactions by using off-chain storage and on-chain verification. It is a type of wallet that is used to store the crypto assets and can be used to send and receive the crypto assets. Currently its implemented for custom tokens where users token are locked in the smart contract and can be used to send and receive the tokens. The wallet is implemented using the concept of merkle maps where the users can send and receive the tokens without any on-chain transactions. The transactions are only done when the user wants to withdraw the tokens from the wallet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Next][next.js]][next-url]
- [![React][react.js]][react-url]
- [Mina]
- [snarkyjs]
- [aurora]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```
- Install the zk cli following the instructions from [here](https://docs.minaprotocol.com/zkapps/tutorials)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/lordshashank/wiz-wallet.git
   ```
2. Go to the contracts folder
   ```sh
   cd contracts
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Run the build command to build js files from the snarky files
   ```sh
   npm run build
   ```
5. Run various scripts to deploy and interact with the smart contract
   ```sh
   node build/src/main
   ```
   similarly frontend could also be run to test it.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

This dapp can be used to make daily transactions on any custom tokens on the mina blockchain. It ensures less on-chain interactions for every small transaction and hence reduces the gas fees. The transactions are only done when the user wants to withdraw the tokens from the wallet.
We look forward to implement this for the mainnet and also for the native tokens along with features that could be quite useful for the users.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@0xlord_forever](https://twitter.com/0xlord_forever) - email@email_client.com

Project Link: [https://github.com/lordshashank/wiz-wallet](https://github.com/lordshashank/wiz-wallet)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- []()
- []()
- []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/lordshashank/wiz-wallet.svg?style=for-the-badge
[contributors-url]: https://github.com/lordshashank/wiz-wallet/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lordshashank/wiz-wallet.svg?style=for-the-badge
[forks-url]: https://github.com/lordshashank/wiz-wallet/network/members
[stars-shield]: https://img.shields.io/github/stars/lordshashank/wiz-wallet.svg?style=for-the-badge
[stars-url]: https://github.com/lordshashank/wiz-wallet/stargazers
[issues-shield]: https://img.shields.io/github/issues/lordshashank/wiz-wallet.svg?style=for-the-badge
[issues-url]: https://github.com/lordshashank/wiz-wallet/issues
[license-shield]: https://img.shields.io/github/license/lordshashank/wiz-wallet.svg?style=for-the-badge
[license-url]: https://github.com/lordshashank/wiz-wallet/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[svelte-url]: https://svelte.dev/
[laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[laravel-url]: https://laravel.com
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[jquery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jquery-url]: https://jquery.com
[Mina]: https://minaprotocol.com/
[snarkyjs]: https://www.npmjs.com/package/snarkyjs
[aurora]: https://www.aurowallet.com/
