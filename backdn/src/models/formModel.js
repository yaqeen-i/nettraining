const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserForm = sequelize.define("UserForm", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  region: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'regions',
      key: 'name'
    },
    validate: {
      isIn: [['NORTHERN', 'CENTRAL', 'SOUTHERN']]
    },
    set(value) {
      this.setDataValue('region', value.toUpperCase());
    }
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: 'areas',
      key: 'name'
    }
  },
  institute: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: 'institutes',
      key: 'name'
    }
  },
  profession: {
    type: DataTypes.STRING(100),
    allowNull: false,
    // references: {
    //   model: 'professions',
    //   key: 'name'
    // }
  },
  nationalID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: true,
      len: [10, 10]
    }
  },
  phoneNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      is: /^(079|078|077)\d{7}$/,
    }
  },
  firstName: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  fatherName: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  grandFatherName: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString().split('T')[0],

      // isWithinAgeRange(value) {
      //   const today = new Date();
      //   const birthDate = new Date(value);
        
      //   // age cal`culation
      //   let age = today.getFullYear() - birthDate.getFullYear();
      //   const monthDiff = today.getMonth() - birthDate.getMonth();
        
      //   // age adjustment if birthday hasn't occurred yet this year
      //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      //     age--;
      //   }
        
      //   if (age < 17 || age > 35) {
      //     throw new Error('Applicant must be between 17 and 35 years old');
      //   }
      // }
    }
  },
  gender: {
    type: DataTypes.STRING(7),
    allowNull: false,
    validate: {
      isIn: [['MALE', 'FEMALE']]
    },
    set(value) {
      this.setDataValue('gender', value.toUpperCase());
    }
  },
  educationLevel: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['HIGH_SCHOOL', 'DIPLOMA', 'BACHELOR', 'MASTER', 'MIDDLE_SCHOOL']]
    },
    set(value) {
      this.setDataValue('educationLevel', value.toUpperCase());
    }
  },
  residence: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  howDidYouHearAboutUs: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isIn: [['SOCIAL_MEDIA', 'RELATIVE', 'GOOGLE_SEARCH']]
    },
    set(value) {
      this.setDataValue('howDidYouHearAboutUs', value.toUpperCase());
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PENDING',
    validate: {
      isIn: [['PENDING', 'ACCEPTED', 'REJECTED']]
    },
    set(value) {
      this.setDataValue('status', value.toUpperCase());
    }
  },
  mark: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  }
},
 {
  timestamps: true,
  tableName: "userForm"
});

module.exports = UserForm;