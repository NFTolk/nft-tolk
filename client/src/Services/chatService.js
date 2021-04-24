import useHandleResponse from '../Utilities/handle-response';
import authHeader from '../Utilities/auth-header';
import { useSnackbar } from 'notistack';

// Receive global messages
export function useGetGlobalMessages() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  const getGlobalMessages = () => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/global`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar('Could not load Global Chat', {
          variant: 'error',
        })
      );
  };

  return getGlobalMessages;
}

// Send a global message
export function useSendGlobalMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const sendGlobalMessage = body => {
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ body: body, global: true }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/global`,
      requestOptions
    )
      .then(handleResponse)
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Could send message', {
          variant: 'error',
        });
      });
  };

  return sendGlobalMessage;
}

// Get a global nft offers
export function useGetGlobalNftOffers() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  const getGlobalNftOffers = () => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/globaloffer`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar('Could not load Global NFT offers', {
          variant: 'error',
        })
      );
  };

  return getGlobalNftOffers;
}

// Send a global nft offers
export function useSendGlobalNftOffer() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const sendGlobalNftOffer = body => {
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ body, global: true, nftOffer: true }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/globaloffer`,
      requestOptions
    )
      .then(handleResponse)
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Could send NFT offer', {
          variant: 'error',
        });
      });
  };

  return sendGlobalNftOffer;
}

// Get list of users conversations
export function useGetConversations() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  const getConversations = () => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/conversations`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar('Could not load chats', {
          variant: 'error',
        })
      );
  };

  return getConversations;
}

// get conversation messages based on
// to and from id's
export function useGetConversationMessages() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  const getConversationMessages = id => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/conversations/query?userId=${id}`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar('Could not load chats', {
          variant: 'error',
        })
      );
  };

  return getConversationMessages;
}

export function useSendConversationMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const sendConversationMessage = (id, body) => {
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ to: id, body: body }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/`,
      requestOptions
    )
      .then(handleResponse)
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Could send message', {
          variant: 'error',
        });
      });
  };

  return sendConversationMessage;
}
