// @ts-check
import { LitElement, html, css } from 'lit';
import './pages/home.js';

export class App extends LitElement {
  static styles = css`
    :host {
      --nav-height: 64px;
      display: block;
      min-height: 100vh;
      height: 100%;
      width: 100%;
      background: radial-gradient(rgba(67, 51, 102, 0.5), rgba(67, 51, 102, 0.0));
    }

    :host main {
      display: flex;
      margin: auto;
      width: 100%;
      height: 100%;
      max-width: 1440px;
      padding-top: var(--nav-height);
    }

    :host #outlet {
      flex: 1;
      width: 100%;
    }

    :host header {
      position: fixed;
      top: 0;
      left: 0;
      height: var(--nav-height);
      padding: 0 20px;
      -webkit-backdrop-filter: blur(16px);
      backdrop-filter: blur(16px);
      background: rgba(3,0,20,.08);
      width: 100vw;
      z-index: 10;
    }

    :host header .nav-wrapper {
      display: flex;
      align-items: center;
      max-width: 1440px;
      height: 100%;
      margin: auto;
      position: relative;
    }

    :host nav .nav-wrapper:before {
      background: radial-gradient(62.87% 100% at 50% 100%,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 100%);
      bottom: 0;
      content: "";
      height: 1px;
      left: 0;
      position: absolute;
      width: 100%;
    }
  `;

  render() {
    return html`
      <header>
        <div class="nav-wrapper">
          <img src="/assets/logo.png" width="80" alt="logo" />
        </div>
      </header>
      <main>
        <div id="outlet">
          <app-home></app-home>
        </div>
      </main>
    `;
  }
}

customElements.define('app-root', App);