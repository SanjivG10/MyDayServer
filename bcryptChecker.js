const bcrypt = require('bcrypt')

 const cmp =  (pass,hash)=>
{
  bcrypt.compare(pass, hash, function(err, valid) {
      if(err)
      {
            console.log("ERROR")
      }

      if(valid)
      {
        console.log(valid)
      }
      else {

        console.log("NOT VALID")
      }

  });
}

module.exports.cmp = cmp
