import { html } from 'htm/preact';
import iris from 'iris-lib';
import { route } from 'preact-router';

import Component from '../../BaseComponent';
import Button from '../../components/basic/Button';
import CopyButton from '../../components/CopyButton';
import Nostr from '../../Nostr';
import { translate as t } from '../../translations/Translation';
import { ExistingAccountLogin } from '../Login';
const bech32 = require('bech32-buffer');

export default class AccountSettings extends Component {
  onLogoutClick(hasPriv) {
    if (hasPriv) {
      route('/logout'); // confirmation screen
    } else {
      Nostr.logOut();
    }
  }

  render() {
    const myPrivHex = iris.session.getKey().secp256k1.priv;
    let myPriv32;
    if (myPrivHex) {
      // eslint-disable-next-line no-undef
      myPriv32 = bech32.encode('nsec', Buffer.from(myPrivHex, 'hex'));
    }
    const myPub = iris.session.getKey().secp256k1.rpub;
    // eslint-disable-next-line no-undef
    const myNpub = bech32.encode('npub', Buffer.from(myPub, 'hex'));

    const hasPriv = !!iris.session.getKey().secp256k1.priv;
    return (
      <>
        <div class="centered-container">
          <h2>{t('account')}</h2>
          <p>
            {hasPriv ? (
              <>
                <b>{t('save_backup_of_privkey_first')}</b> {t('otherwise_cant_log_in_again')}
              </>
            ) : null}
          </p>
          <div style="">
            <Button onClick={() => this.onLogoutClick(hasPriv)}>{t('log_out')}</Button>
            <Button
              onClick={() =>
                this.setState({
                  showSwitchAccount: !this.state.showSwitchAccount,
                })
              }
            >
              {t('switch_account')}
            </Button>
          </div>
          {this.state.showSwitchAccount ? html`<${ExistingAccountLogin} />` : ''}

          <h3>Key</h3>
          <div className="flex-table">
            <div className="flex-row">
              <div className="flex-cell">
                <p>Public key:</p>
                <input type="text" value={myNpub} />
              </div>
              <div className="flex-cell no-flex">
                <CopyButton copyStr={myPub} text="Copy hex" />
                <CopyButton copyStr={myNpub} text="Copy npub" />
              </div>
            </div>
            <div className="flex-row">
              <div className="flex-cell">Private key</div>
              <div className="flex-cell no-flex">
                {myPrivHex ? (
                  <>
                    <CopyButton notShareable={true} copyStr={myPrivHex} text="Copy hex" />
                    <CopyButton notShareable={true} copyStr={myPriv32} text="Copy nsec" />
                  </>
                ) : (
                  <p>Not present. Good!</p>
                )}
              </div>
            </div>
          </div>
          {myPrivHex ? <p>{t('private_key_warning')}</p> : ''}
        </div>
      </>
    );
  }
}