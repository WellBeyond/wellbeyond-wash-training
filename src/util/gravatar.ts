// import {createHash} from 'crypto';
import Sha256 from 'crypto-js/sha256';

export const getGravatarUrl = (email?:string) => {
  if (!email) {
    return 'https://www.gravatar.com/avatar?d=mm&s=140'
  }
  // const hash = createHash('md5')
  //   .update(email.toLowerCase().trim())
  //   .digest('hex');

  const hash = Sha256(email.toLowerCase().trim()).toString();

  return 'https://www.gravatar.com/avatar/' + hash + '?d=mm&s=140'
}

