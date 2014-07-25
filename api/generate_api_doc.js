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
var invoices = {
    page: 'api/invoices',
    endpointPath: 'invoices',
    description: 'Invoices sent to companies. The invoice state is an enum with the possible values OUTSTANDING, OVERDUE or PAID.',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get all invoices.',
            returns: 'A page of invoices.',
            pageable: true,
            security: 'ROLE_ADMIN'
        },
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single invoice by its id.',
            returns: 'One invoice.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'GET',
            path: '/search/findByInvoiceState',
            description: 'Find invoices by their state.',
            returns: 'A page of invoices.',
            pageable: true,
            security: 'ROLE_ADMIN',
            parameters: [
                {
                    name: 'state',
                    type: 'invoice state',
                    required: true,
                    description: 'The invoice state to search for.'
                }
            ]
        },
        {
            method: 'GET',
            path: '/search/findByIdentifierLikeIgnoreCaseAndInvoiceState',
            description: 'Find invoices by their state and identifier.',
            returns: 'A page of invoices.',
            pageable: true,
            security: 'ROLE_ADMIN',
            parameters: [
                {
                    name: 'identifier',
                    type: 'String',
                    required: true,
                    description: 'The identifier to search for. % is wildcard.'
                },
                {
                    name: 'state',
                    type: 'invoice state',
                    required: true,
                    description: 'The invoice state to search for.'
                }
            ]
        },
        {
            method: 'GET',
            path: '/search/findByCreationDateBetween',
            description: 'Find invoices in an interval.',
            returns: 'A list of invoices.',
            security: 'ROLE_ADMIN',
            parameters: [
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
            description: 'Create a new invoice. Returns the created object. If the due date is in the past the state is set to OVERDUE.',
            returns: 'A single invoice.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'POST',
            path: '/{id}/markPaid',
            description: 'Mark an invoice as paid.',
            returns: '"Ok." if it succeeded.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the invoice identified by id. Returns the updated object. If the due date is in the past the state is set to OVERDUE.',
            returns: 'An invoice.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete the invoice identified by id.',
            returns: 'Nothing',
            security: 'ROLE_ADMIN'
        }
    ],
    projections: [
        {
            name: 'withDebitor',
            description: 'The debitor company is embedded.'
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
            name: 'identifier',
            type: 'String',
            validations: 'not empty, unique'
        },
        {
            name: 'creationDate',
            type: 'Date',
            validations: 'not null'
        },
        {
            name: 'invoiceTotal',
            type: 'Number',
            validations: '> 0'
        },
        {
            name: 'dueDate',
            type: 'Date'
        },
        {
            name: 'invoiceState',
            type: 'invoice state enum',
            validations: 'not empty'
        }
    ],
    links: [

    ]
};
var principal = {
    page: 'api/principal',
    endpointPath: 'principal',
    description: 'This is not an own entity but returns the <a href="credentials.html">credential</a> entity for the currently logged in user.',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            returns: 'A credential.',
            description: 'Get the credential entity for the logged in user.'
        }
    ],
    structure: [
        {
            name: 'See credential'
        }
    ]
};
var projects = {
    page: 'api/projects',
    endpointPath: 'projects',
    description: 'Projects belong to companies and employees can work on them.',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get all projects.',
            returns: 'A page of projects.',
            pageable: true
        },
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single project by its id.',
            returns: 'One project.'
        },
        {
            method: 'GET',
            path: '/search/findByIdentifier',
            description: 'Find projects by their identifier.',
            returns: 'A list of projects',
            parameters: [
                {
                    name: 'identifier',
                    type: ' String',
                    required: true,
                    description: 'The project identifier to search for./**/'
                }
            ]
        },
        {
            method: 'GET',
            path: '/search/findByNameLikeIgnoreCaseOrIdentifierLikeIgnoreCaseOrderByNameAsc',
            description: 'Search by name or identifier, ignoring their case with wildcards.',
            returns: 'A list of projects.',
            parameters: [
                {
                    name: 'name',
                    type: 'String',
                    required: true,
                    description: 'The name to search for. Wildcard is %.'
                },
                {
                    name: 'identifier',
                    type: 'String',
                    required: true,
                    description: 'The identifier to search for. Wildcard is %.'
                }
            ]
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new project. Returns the created object.',
            returns: 'A single project.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the project identified by id. Returns the updated object.',
            returns: 'A single project.',
            security: 'ROLE_ADMIN'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete a the project identified by id.',
            returns: 'Nothing',
            security: 'ROLE_ADMIN'
        }
    ],
    projections: [
        {
            name: 'withCompanyAndDebitor',
            description: 'The company and debitor of the project are embedded.'
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
            name: 'identifier',
            type: 'String',
            validations: 'not empty, unique'
        },
        {
            name: 'name',
            type: 'String',
            validations: 'not empty'
        },
        {
            name: 'volume',
            type: 'Integer',
            validations: '> 0'
        },
        {
            name: 'hourlyRate',
            type: 'Number',
            validations: '> 0'
        },
        {
            name: 'dailyRate',
            type: 'Number',
            validations: '> 0'
        },
        {
            name: 'fixedPrice',
            type: 'Number',
            validations: '> 0'
        }
    ],
    links: [
        {
            name: 'company',
            type: 'companies',
            security: 'delete and update by ROLE_ADMIN'
        },
        {
            name: 'debitor',
            type: 'companies',
            security: 'delete and update by ROLE_ADMIN'
        },
        {
            name: 'workTimes',
            type: 'workTimes',
            security: 'delete and update by ROLE_ADMIN'
        },
        {
            name: 'billableTimes',
            type: 'billableTimes',
            security: 'delete and update by ROLE_ADMIN'
        }
    ]
};
var sickDays = {
    page: 'api/sickDays',
    endpointPath: 'sickDays',
    description: '<a href="employees.html">Employees</a> can track when they are sick.',
    endpoints: [
        {
            method: 'GET',
            path: '/{id}',
            description: 'Get a single sickDay by its id.',
            returns: 'One sickDay.',
            security: 'ROLE_ADMIN or owning employee.'
        },
        {
            method: 'GET',
            path: '/search/findByEmployee',
            description: 'Find all sickDays for an employee.',
            returns: 'A list of sickDays.',
            security: 'Only the owning employee.',
            parameters: [
                {
                    name: 'employee',
                    type: 'Long',
                    required: true,
                    description: 'The employee to fetch the sickDays for.'
                }
            ]
        },
        {
            method: 'GET',
            path: '/search/findByStartDateBetweenOrEndDateBetween',
            description: 'Find all sickDays that have the start date in a given interval or the end date in another given interval.',
            returns: 'A list of sickDays.',
            security: 'ROLE_ADMIN',
            parameters: [
                {
                    name: 'startLower',
                    type: 'Date',
                    required: true,
                    description: 'The lower bound for the start date interval.'
                },
                {
                    name: 'startHigher',
                    type: 'Date',
                    required: true,
                    description: 'The upper bound for the start date interval.'
                },
                {
                    name: 'endLower',
                    type: 'Date',
                    required: true,
                    description: 'The lower bound for the end date interval.'
                },
                {
                    name: 'endHigher',
                    type: 'Date',
                    required: true,
                    description: 'The upper bound for the end date interval.'
                }
            ]
        },
        {
            method: 'POST',
            path: '/',
            description: 'Create a new sickDay. Returns the created object. Sends an email to all ROLE_SUPERVISOR employees about the new sickDay.',
            returns: 'A single sickDay.',
            security: 'ROLE_ADMIN or owning employee.'
        },
        {
            method: 'PUT',
            path: '/{id}',
            description: 'Update the sickDay identified by id. Returns the updated object. Sends an email to all ROLE_SUPERVISOR employees about the updated sickDay.',
            returns: 'A single sickDay.',
            security: 'ROLE_ADMIN or owning employee.'
        },
        {
            method: 'DELETE',
            path: '/{id}',
            description: 'Delete a the sickDay identified by id.',
            returns: 'Nothing',
            security: 'ROLE_ADMIN'
        }
    ],
    projections: [
        {
            name: 'withEmployee',
            description: 'The employee is embedded.'
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
            name: 'startDate',
            type: 'Date',
            validations: 'not null'
        },
        {
            name: 'endDate',
            type: 'Date'
        }
    ],
    links: [
        {
            name: 'employee',
            type: 'employees',
            security: 'No update or delete.'
        }
    ]
};
var translations = {
    page: 'api/translations',
    endpointPath: 'translations',
    description: 'This are the translations for our AngularJS frontend.',
    endpoints: [
        {
            method: 'GET',
            path: '/',
            description: 'Get translations for the locale of the currently logged in user.',
            returns: 'Translations JSON object.'
        },
        {
            method: 'PUT',
            path: '/',
            description: 'Change the locale for the currently logged in user. Also updates her/his credential object.',
            parameters: [
                {
                    name: 'locale',
                    type: 'String',
                    required: true,
                    description: 'The locale to use. Currently only en or de.'
                }
            ],
            returns: '"Ok."'
        }
    ],
    structure: [
        {
            name: 'JSON object containing translations.'
        }
    ]
};
var api = [address_book, addresses, authorities, billableTimes, contactPersons, companies, credentials, employees, federalStates, holidays, invoices, principal, projects,
    sickDays, translations];

for (var i = 0; i < api.length; i++) {
    var apiElement = api[i];
    var html = jade.renderFile('api_template.jade', apiElement);
    fs.writeFile(apiElement.endpointPath + '.html', html);
}