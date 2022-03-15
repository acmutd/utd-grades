import _ from 'lodash';
import fetch from 'isomorphic-fetch';

export default {
  base() {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:4000/development';
    } else if (process.env.NODE_ENV === 'test') {
      return 'https://0qqbseweak.execute-api.us-east-2.amazonaws.com';
    } else {
      return 'https://4i5536aptc.execute-api.us-east-2.amazonaws.com';
    }
  },
  getCurrentBase() {
    let url = window.location.protocol + '//' + window.location.hostname;
     
    if (window.location.port) {
      url += ':' + window.location.port;
    }
     
    return url;
  },
  apiRoot: '',
  options: {
    headers: {},
  },

  /**
   * Dynamically constructs JSON API request.
   *
   * @param {string} dataType
   * @param {string} method
   * @param {string} id
   * @param {Object} body
   * @param {Object} settings
   * @return {Promise}
   */
  request(dataType, method, id, query, body, settings) {
    const { serialize, resolve } = this.processSettings(settings);
    const url = this.processUrl(dataType, id, query);
    const options = this.processOptions(body, method, serialize);

    return fetch(url, options)
      .then(this.checkStatus)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return this.processResponse(data, resolve);
      });
  },
  processUrl(dataType, id, query = '') {
    let url = this.base() + this.apiRoot + '/' + dataType;

    if (id != null) {
      url += '/' + id;
    }
    
    if (query != null) {
      if (_.isString(query)) {
        url += query;
      } else {
        url += this.processQuery(query);
      }
    }
    
    return url;
  },
  processOptions(body, method, serialize) {
    let options = { 
      ...this.options
    };

    if (body) {
      if (serialize) {
        options.body = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json; charset=utf-8';
      } else {
        options.body = body;
      }
    }

    if (method) {
      options.method = method;
    }

    return options;
  },
  processResponse(body, resolve) {
    if (body != null) {
      if (resolve) {
        if (body.data) {
          return body.data;
        }
      }
    }
   
    return body;
  },
  /**
   * Checks for error status.
   *
   * @param {Object} response
   * @return {Object}
   * @throws {Error}
   */
  checkStatus(response) {
    return new Promise((resolve, reject) => {
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        return response.json()
          .then((error) => {
            if (response.status === 401) {
              reject(new Error('NOT_AUTHENTICATED'));
            } else {
              reject(new Error(error.message || error.name));
            }
          })
          .catch((error) => {
            reject(new Error());
          });
      }
    });
  },
  processQuery(data) {
    let ret = [];
    
    for (let d in data) {
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    }
      
    return '?' + ret.join("&");
  },
  processSettings(settings) {
    if (settings) {
      if (settings.serialize == null) {
        settings.serialize = true;
      }

      if (settings.resolve == null) {
        settings.resolve = true;
      }

      return settings;
    } else {
      settings = {
        serialize: true,
        resolve: true,
      };

      return settings;
    }
  },
  pageToSkip(page, limit) {
    return (page - 1) * limit;
  },
  getFromStateOrDefault(property, value, state, defaultValue) {
    if (_.isNil(value)) {
      if (!_.isNil(state[property])) {
        return state[property];
      } else {
        return defaultValue;
      }
    } else {
      return value;
    }
  },
  constructSort(sortField, sortType) {
    let sort = `$sort[${sortField}]=`;

    if (sortType === 'DESC') {
      sort += '-1';
    } else {
      sort += '1';
    }
    
    return sort;
  }
};
