import {_fetch} from '../helpers/_fetch';

const UserAPI = {
  me: () => {
    const request = {
      method: 'GET',
      body: {},
    };
    return _fetch(`/me`, request);
  },
  orders: paramBody => {
    const request = {
      method: 'POST',
      body: paramBody,
    };
    return _fetch(`/order`, request);
  },
  createOrder: paramBody => {
    const request = {
      method: 'POST',
      body: paramBody,
    };
    return _fetch(`/create-order`, request);
  },
  bulkOrders: paramBody => {
    const request = {
      method: 'POST',
      body: paramBody,
    };
    return _fetch(`/bulk-order`, request);
  },
  updateOrder: (paramBody, id) => {
    const request = {
      method: 'PUT',
      body: paramBody,
    };
    return _fetch(`/update-order/${id}`, request);
  },
  cancelOrder: (paramBody, id) => {
    const request = {
      method: 'POST',
      body: paramBody,
    };
    return _fetch(`/cancel-order/${id}`, request);
  },
  products: paramBody => {
    const request = {
      method: 'POST',
      body: paramBody,
    };
    return _fetch(`/products`, request);
  },

  carts: () => {
    const request = {
      method: 'GET',
      body: {},
    };
    return _fetch(`/cart/list`, request);
  },
  saveCart: paramBody => {
    const request = {
      method: 'POST',
      body: paramBody,
    };
    return _fetch(`/cart/create`, request);
  },
  updateCart: (paramBody, id) => {
    const request = {
      method: 'PUT',
      body: paramBody,
    };
    return _fetch(`/cart/update/${id}`, request);
  },
  deleteCart: id => {
    const request = {
      method: 'DELETE',
      body: {},
    };
    return _fetch(`/cart/delete/${id}`, request);
  },
};

export default UserAPI;
