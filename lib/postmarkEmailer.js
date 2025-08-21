// postmarkEmailer.js:

"use strict";

// load all necessary modules
const { BaseEmailer } = require("zyx-base");
const nodemailer = require("nodemailer");
const postmarkTransport = require("nodemailer-postmark-transport");

/**
 * Emailer class that integrates with Postmark using Nodemailer transport.
 *
 * Extends the BaseEmailer to provide email sending capabilities
 * via the Postmark service.
 *
 * @class
 * @extends BaseEmailer
 */
class PostmarkEmailer extends BaseEmailer {
  /**
   * Initializes and sets up the Postmark transport using the API key
   * from configuration.
   *
   * @async
   * @returns {Promise<void>}
   */
  async connect() {
    this.transport = nodemailer.createTransport(
      postmarkTransport({
        auth: {
          apiKey: this.config.postmark_api_key,
        },
      })
    );
  }

  /**
   * Resets the transport, effectively disconnecting the emailer.
   *
   * @async
   * @returns {Promise<void>}
   */
  async disconnect() {
    this.transport = undefined;
  }

  /**
   * Sends the email using the Postmark transport.
   *
   * If the transport is not initialized, it connects first.
   * Then it builds the message object and sends it.
   *
   * @async
   * @param {Object} [data={}] - Optional data to inject into templates.
   * @returns {Promise<Object>} Result of the `sendMail` operation from Nodemailer.
   * @throws {Error} If message building or sending fails.
   */
  async send(data = {}) {
    if (!this.Transport) {
      await this.connect();
    }

    const msg = await this.buildMessageObject(data);
    return this.Transport.sendMail(msg);
  }
}

module.exports = PostmarkEmailer;
