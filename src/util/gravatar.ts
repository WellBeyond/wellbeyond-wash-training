// import {createHash} from 'crypto';
// import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';

export const getGravatarUrl = (email?:string) => {
  if (!email) {
    return 'https://www.gravatar.com/avatar?d=mm&s=140'
  }
  const newHash = CryptoJS.MD5(email.toLowerCase().trim()).toString();
  // const hash = createHash('md5')
  //   .update(email.toLowerCase().trim())
  //   .digest('hex');

  return 'https://www.gravatar.com/avatar/' + newHash + '?d=mm&s=140'
}

