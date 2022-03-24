import data from '../../utils/data';
import utils from './utils';

export async function fetchSections(key, params) {
  let response = await data.request('section', 'get', null, params);

  response = utils.expandSemesterNames(response);

  return response;
}

export async function fetchSection(id) {
  let response = await data.request('section', 'get', id);

  response = utils.expandSemesterName(response);

  return response;
}
