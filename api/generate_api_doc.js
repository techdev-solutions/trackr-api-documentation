var jade = require('jade');
var fs = require('fs');

var address_book = {
    page: 'api/address_book',
    description: '',
    endpointPath: 'address_book',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get the address book containing all employees except the admin.',
            returns: 'Page of addressbook entries.',
            pageable: true,
            security: 'ROLE_EMPLOYEE'
        }
    ],
    structure: [
        {
            name: 'firstName',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'lastName',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'phoneNumber',
            type: 'String'
        },
        {
            name: 'title',
            type: 'String'
        },
        {
            name: 'email',
            type: 'String',
            validations: 'valid email address'
        }
    ]
};
var addresses = {
    page: 'api/addresses',
    description: 'Addresses for companies.',
    endpointPath: 'addresses',
    endpoints: [
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single address by its id.',
            returns: 'One address.'
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new address. Returns the created object.',
            returns: 'A single address.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the address identified by id. Returns the updated object.',
            returns: 'A single address.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete a the address identified by id.',
            returns: 'Nothing',
            security: 'ROLE_ADMIN'
        }
    ],
    structure: [
        {
            name: 'id',
            type: 'Long'
        },
        {
            name: 'version',
            type: 'Integer'
        },
        {
            name: 'street',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'houseNumber',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'zipCode',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'city',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'country',
            type: 'String',
            validations: 'not empty'
        }
    ]
};
var authorities = {
    page: 'api/authorities',
    description: '',
    endpointPath: 'authorities',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get all authorities that are defined',
            returns: 'List of authorities'
        },
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get one authority by its id.',
            returns: 'One authority.'
        }
    ],
    structure: [
        {
            name: 'id',
            type: 'Long'
        },
        {
            name: 'authority',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'order',
            type: 'Integer',
            validations: '> 0'
        }
    ]
};
var billableTimes = {
    page: 'api/billableTimes',
    description: 'A billable time is an amount of minutes belonging to an employee and a project that is put on the bill for this project. Billable times are typically created from the <a href="../api/work_times.html">work times</a> an employee has entered for that day.',
    endpointPath: 'billableTimes',
    endpoints: [
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single billable time by its id.',
            returns: 'One billable time.',
            security: 'ROLE_SUPERVISOR'
        },
        {
            method: 'GET',
            path: '/search/findByProjectAndDateBetweenOrderByDateAsc',
            description: 'Find work times by their project and the date between two given dates.',
            returns: 'List of billable times.',
            security: 'ROLE_SUPERVISOR',
            parameters: [
                {
                    name: 'project',
                    type: 'Long',
                    required: true,
                    description: 'The id of the project'
                },
                {
                    name: 'start',
                    type: 'Date',
                    required: true,
                    description: 'The start of the interval'
                },
                {
                    name: 'end',
                    type: 'Date',
                    required: true,
                    description: 'The end of the interval'
                }
            ]
        },
        {
            method: 'GET',
            path: '/search/findByDateBetween',
            description: 'Find all billable times between two dates.',
            returns: 'List of billable times.',
            security: 'ROLE_ADMIN',
            parameters: [
                {
                    name: 'start',
                    type: 'Date',
                    required: true,
                    description: 'The start of the interval'
                },
                {
                    name: 'end',
                    type: 'Date',
                    required: true,
                    description: 'The end of the interval'
                }
            ]
        },
        {
            method: 'GET',
            path: '/findEmployeeMappingByProjectAndDateBetween',
            description: 'Get all billable minutes for one project and employee in an interval summed up.',
            returns: 'Map of String to Integer (employee full name -> summed up minutes)',
            security: 'ROLE_SUPERVISOR',
            parameters: [
                {
                    name: 'project',
                    type: 'Long',
                    required: true,
                    description: 'The id of the project'
                },
                {
                    name: 'start',
                    type: 'Date',
                    required: true,
                    description: 'The start of the interval'
                },
                {
                    name: 'end',
                    type: 'Date',
                    required: true,
                    description: 'The end of the interval'
                }
            ]
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new billable time. Returns the created object.',
            returns: 'A single billable time.',
            security: 'ROLE_SUPERVISOR'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the billable time identified by id. Returns the updated object.',
            returns: 'A billable time.',
            security: 'ROLE_SUPERVISOR'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete the billable time identified by id.',
            returns: 'Nothing',
            security: 'ROLE_SUPERVISOR'
        }
    ],
    projections: [
        {
            name: 'withProject',
            description: 'Contains the project embedded'
        }
    ],
    structure: [
        {
            name: 'id',
            type: 'Long'
        },
        {
            name: 'version',
            type: 'Integer'
        },
        {
            name: 'date',
            type: 'Date',
            validations: 'not null'
        },
        {
            name: 'minutes',
            type: 'Integer',
            validations: '> 0, not null'
        }
    ],
    links: [
        {
            name: 'employee',
            type: 'employees',
            security: 'not deletable, updateable by ROLE_SUPERVISOR'
        },
        {
            name: 'project',
            type: 'projects',
            security: 'not deletable, updateable by ROLE_SUPERVISOR'
        }
    ]
};
var contactPersons = {
    page: 'api/contactPersons',
    description: 'Contact persons belong to a company.',
    endpointPath: 'contactPersons',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get all contact persons.',
            returns: 'List of contact persons.'
        },
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single contact person by its id.',
            returns: 'One contact person.'
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new contact person. Returns the created object.',
            returns: 'A single contact person.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the contact person identified by id. Returns the updated object.',
            returns: 'A contact person.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete the contact person identified by id.',
            returns: 'Nothing',
            security: 'ROLE_ADMIN'
        }
    ],
    structure: [
        {
            name: 'id',
            type: 'Long'
        },
        {
            name: 'version',
            type: 'Integer'
        },
        {
            name: 'salutation',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'firstName',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'lastName',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'email',
            type: 'String',
            validations: 'valid email address'
        },
        {
            name: 'phone',
            type: 'String'
        },
        {
            name: 'roles',
            type: 'String'
        }
    ],
    links: [
        {
            name: 'company',
            type: 'companies',
            security: 'deletable, updateable by ROLE_SUPERVISOR'
        }
    ]
};
var companies = {
    page: 'api/companies',
    description: 'A company is a holder of projects or a debitor for projects.',
    endpointPath: 'companies',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get all companies.',
            returns: 'A page of companies.',
            pageable: true
        },
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single company time by its id.',
            returns: 'One company.'
        },
        {
            method: 'GET',
            path: '/search/findByCompanyId',
            description: 'Find companies by their id.',
            returns: 'A list of companies.',
            parameters: [
                {
                    name: 'companyId',
                    type: 'String',
                    required: true,
                    description: 'The company id to query for.'
                }
            ]
        },
        {
            method: 'GET',
            path: '/search/findByNameLikeIgnoreCaseOrderByNameAsc',
            description: 'Find companies by searching for a name.',
            returns: 'A list of companies.',
            parameters: [
                {
                    name: 'name',
                    type: 'String',
                    required: true,
                    description: 'The name to search for. Wildcards are %.'
                }
            ]
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new company. Returns the created object.<p>Since a company needs an address, use <a href="#POST/createWithAddress">/createWithAddress</a> instead.</p>',
            returns: 'A single company.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'POST',
            path: '/createWithAddress',
            description: 'Create a new company together with an address.',
            security: 'ROLE_ADMIN',
            returns: 'A single company.',
            parameters: 'The request body must contain an object consisting of a valid <a href="companies.html">company</a> and <a href="addresses.html">address</a>.<pre>{\n\t"company": { "companyId": ...},\n\t"address": { "street": ...}\n}</pre>'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the company identified by id. Returns the updated object.',
            security: 'ROLE_ADMIN',
            returns: 'A single company.'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete a the company identified by id.',
            security: 'ROLE_ADMIN',
            returns: 'Nothing.'
        }
    ],
    projections: [
        {
            name: 'withAddressAndContactPersons',
            description: 'Contains the address and contact persons.'
        }
    ],
    structure: [
        {
            name: 'id',
            type: 'Long'
        },
        {
            name: 'version',
            type: 'Integer'
        },
        {
            name: 'companyId',
            type: 'Long',
            validations: '> 0, unique, not null'
        },
        {
            name: 'name',
            type: 'String',
            validation: 'not empty'
        }

    ],
    links: [
        {
            type: 'addresses',
            name: 'address',
            security: 'deletable, updateable by ROLE_SUPERVISOR'
        },
        {
            type: 'contactPersons',
            name: 'contactPersons',
            security: 'deletable, updateable by ROLE_SUPERVISOR'
        },
        {
            type: 'projects',
            name: 'projects',
            security: 'deletable, updateable by ROLE_SUPERVISOR'
        }
    ]
};
var credentials = {
    page: 'api/credentials',
    description: 'Credential is the login data belonging to an employee. Credentials have the same id as the belonging employee.',
    endpointPath: 'credentials',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get all credentials.',
            returns: 'A page of credentials.',
            pageable: true
        },
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single credential by its id.',
            returns: 'One credential.'
        },
        {
            method: 'GET',
            path: '/search/findByEmail',
            description: 'Find credentials by an email address.',
            returns: 'A list of credentials.',
            parameters: [
                {
                    name: 'email',
                    type: 'String',
                    required: true,
                    description: 'The email to search for.'
                }
            ]
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new credential. Returns the created object.',
            returns: 'A single credential.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the credential identified by id. Returns the updated object.',
            returns: 'A credential.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete the credential identified by id.',
            returns: 'Nothing',
            security: 'ROLE_ADMIN'
        }
    ],
    projections: [
        {
            name: 'allRolesOverview',
            description: 'Contains all authorities.'
        }
    ],
    structure: [
        {
            name: 'id',
            type: 'Long'
        },
        {
            name: 'email',
            type: 'String',
            validations: 'valid email address, unique'
        },
        {
            name: 'enabled',
            type: 'boolean'
        },
        {
            name: 'locale',
            type: 'String',
            validations: 'not empty'
        }
    ],
    links: [
        {
            name: 'employee',
            type: 'employees',
            security: 'deletable, updateable by ROLE_ADMIN'
        },
        {
            name: 'authorities',
            type: 'authorities',
            security: 'deletable, updateable by ROLE_ADMIN'
        }
    ]
};
var employees = {
    page: 'api/employees',
    endpointPath: 'employees',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Find all employees.',
            returns: 'A page of employees.',
            security: 'ROLE_SUPERVISOR',
            pageable: true
        },
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single employee by her/his id.',
            returns: 'A single employee.',
            security: 'ROLE_SUPERVISOR'
        },
        {
            method: 'GET',
            path: '/{id}/self',
            description: 'An accessor for employees to get their own object reduced to a few fields.',
            returns: 'A reduced employee, only the fields firstName, lastName and phoneNumber are present.',
            security: 'Only the employee her/himself.'
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new employee. Returns the created object.',
            security: 'ROLE_ADMIN',
            returns: 'A single employee.'
        },
        {
            method: 'POST',
            path: '/createWithCredential',
            description: 'Create a new employee together with his/her credential',
            security: 'ROLE_ADMIN',
            returns: 'A single employee',
            parameters: 'Expects an object containing a valid <a href="employees.html">employee</a> and <a href="credentials.html">credential</a>.<pre>{\n\t"employee": { "firstName": ...},\n\t"credential": { "email": ...}\n}</pre>'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update an existing employee. If the leaveDate is in the past after the update the <a href="credentials.html">credential</a> belonging to the employee will automatically be deactivated.',
            security: 'ROLE_SUPERVISOR',
            returns: 'A single employee.'
        },
        {
            method: 'PUT',
            path: '/{id}/self',
            description: 'An employee can update a restricted set of fields on his own employee entity with this method.',
            security: 'Only the employee her/himself.',
            returns: 'A single reduced employee',
            parameters: 'The request body must be a reduced employee (can be partial):<pre>{ "firstName": ..., "lastName": ..., "phoneNumber": ...}</pre>'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete the employee identified by id.',
            security: 'ROLE_ADMIN',
            returns: 'Nothing.'
        }
    ],
    projections: [
        {
            name: 'withCredential',
            description: 'Has the credentials embedded.'
        }
    ],
    structure: [
        {
            name: 'id',
            type: 'Long'
        },
        {
            name: 'version',
            type: 'Integer'
        },
        {
            name: 'firstName',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'lastName',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'phoneNumber',
            type: 'String'
        },
        {
            name: 'title',
            type: 'String'
        },
        {
            name: 'salary',
            type: 'Number'
        },
        {
            name: 'hourlyCostRate',
            type: 'Number'
        },
        {
            name: 'joinDate',
            type: 'Date'
        },
        {
            name: 'leaveDate',
            type: 'Date'
        },
        {
            name: 'federalState',
            type: '<a href="federalStates.html">federal state</a>'
        },
        {
            name: 'vacationEntitlement',
            type: 'Number'
        }
    ],
    links: [
        {
            name: 'credential',
            type: 'credentials',
            security: 'no update or delete'
        },
        {
            name: 'workTimes',
            type: 'workTimes',
            security: 'no update or delete'
        },
        {
            name: 'billableTimes',
            type: 'billableTimes',
            security: 'no update or delete'
        },
        {
            name: 'vacationRequests',
            type: 'vacationRequests',
            security: 'no update or delete'
        },
        {
            name: 'approvedRequests',
            type: 'approvedRequests',
            security: 'no update or delete'
        },
        {
            name: 'travelExpenseReports',
            type: 'travelExpenseReports',
            security: 'no update or delete'
        }
    ]
};
var federalStates = {
    page: 'api/federalStates',
    endpointPath: 'federalStates',
    description: 'Get all federal states in Germany.',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get all federal states.',
            returns: 'A list of federal states.'
        }
    ],
    structure: [
        {
            name: 'name',
            type: 'enum constant'
        },
        {
            name: 'state',
            type: 'String'
        }
    ]
};
var holidays = {
    page: 'api/holidays',
    endpointPath: 'holidays',
    description: 'Public holidays that are different for each state.',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get all holidays.',
            returns: 'A list of holidays.'
        },
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single holiday by its id.',
            returns: 'One holiday.'
        },
        {
            method: 'GET',
            path: '/search/findByFederalStateAndDayBetween',
            description: 'Find holidays for a federal state between two dates.',
            returns: 'A list of holidays.',
            parameters: [
                {
                    name: 'federalState',
                    type: '<a href="federalStates.html">federal state</a>',
                    required: true,
                    description: 'The federal state to search for.'
                },
                {
                    name: 'start',
                    type: 'Date',
                    required: true,
                    description: 'The start of the interval.'
                },
                {
                    name: 'end',
                    type: 'Date',
                    required: true,
                    description: 'The end of the interval.'
                }
            ]
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new holiday. Returns the created object.',
            returns: 'A single holiday.'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the holiday identified by id. Returns the updated object.',
            returns: 'A single holiday.'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete a the holiday identified by id.',
            returns: 'Nothing'
        }
    ],
    structure: [
        {
            name: 'id',
            type: 'Long'
        },
        {
            name: 'day',
            type: 'Date'
        },
        {
            name: 'name',
            type: 'String'
        },
        {
            name: 'federalState',
            type: '<a href="federalStates.html">federal state</a>'
        }
    ]
};
var api = [address_book, addresses, authorities, billableTimes, contactPersons, companies, credentials, employees, federalStates, holidays];

for (var i = 0; i < api.length; i++) {
    var apiElement = api[i];
    var html = jade.renderFile('api_template.jade', apiElement);
    fs.writeFile(apiElement.endpointPath + '.html', html);
}