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
    allowNull: false,
    validate: {
    len: {
      args: [2, 15],
      msg: "Last name must be between 2 and 15 characters"
    },
    is: {
      args: /^[A-Za-z\u0600-\u06FF]+$/,
      msg: "Last name can only contain letters"
    }
  }
  },
  fatherName: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      len: {
        args: [2, 15],
        msg: "Father name must be between 2 and 15 characters"
      },
      is: {
        args: /^[A-Za-z\u0600-\u06FF]+$/,
        msg: "Father name can only contain letters"
      }
    }
  },
  grandFatherName: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      len: {
        args: [2, 15],
        msg: "Grandfather name must be between 2 and 15 characters"
      },
      is: {
        args: /^[A-Za-z\u0600-\u06FF]+$/,
        msg: "Grandfather name can only contain letters"
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      len: {
        args: [2, 15],
        msg: "Last name must be between 2 and 15 characters"
      },
      is: {
        args: /^[A-Za-z\u0600-\u06FF]+$/,
        msg: "Last name can only contain letters"
      }
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString().split('T')[0],

      isWithinAgeRange(value) {
        const today = new Date();
        const birthDate = new Date(value);
        
        // age calculation
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // age adjustment if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        const gender = this.gender?.toUpperCase();

      if (gender === "FEMALE") {
        if (age < 17 || age > 35) {
          throw new Error("Female applicants must be between 17 and 35 years old");
        }
      } else if (gender === "MALE") {
        if (age < 17 || age > 30) {
          throw new Error("Male applicants must be between 17 and 30 years old");
        }
      } else {
        throw new Error("Gender must be specified for age validation");
      }
      }
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
    allowNull: false,
    validate: {
      len: {
        args: [5, 100],
        msg: "Residence must be between 5 and 100 characters"
      }
    }
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
    type: DataTypes.STRING(21),
    allowNull: false,
    defaultValue: 'PENDING',
    validate: {
      isIn: [['PENDING', 'PHONE_CALL', 'PASSED_THE_EXAM', 'WAITING_FOR_DOCUMENTS', 'ACCEPTED', 'REJECTED']]
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
  },
  requiredDocuments: {
    type: DataTypes.STRING(3),
    allowNull: true,
    defaultValue: 'NO',
  }
},
 {
  timestamps: true,
  tableName: "userForm"
});

module.exports = UserForm;