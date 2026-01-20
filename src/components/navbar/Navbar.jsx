import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useSelector } from 'react-redux'

const navigation = [
  { name: 'Dashboard', href: '/', current: false },
  { name: 'Leads', href: '/leads', current: false },
  { name: 'Accounts', href: '/accounts', current: false },
  { name: 'Contacts', href: '/contacts', current: false },
  { name: 'Opportunities', href: '/opportunities', current: false },
  { 
    name: 'Activities', 
    href: '#', 
    current: false,
    submenu: [
      { label: "Tasks", href: "/activities/tasks" },
      { label: "Calendar", href: "/activities/calendar" },
      { label: "Meetings", href: "/activities/meetings" }
    ],
    icon: <ChevronDownIcon className="h-4 w-4 text-white" />
  },
  { 
    name: 'Reports', 
    href: '#', 
    current: false,
    submenu: [
      { label: "Sales Pipeline", href: "/reports/pipeline" },
      { label: "Revenue Forecast", href: "/reports/forecast" },
      { label: "Activity Logs", href: "/reports/activity" }
    ],
    icon: <ChevronDownIcon className="h-4 w-4 text-white" />
  },
  // { name: 'Settings', href: '/settings', current: false },

]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {

  const { handleLogout } = useAuth()

  const {user}=useSelector((state)=>state.auth)

  console.log(user?.data?.name);

  const [openIndex, setOpenIndex] = useState(null)
  const location = useLocation()
  const navigate=useNavigate();
  // Update current based on route
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href,
    submenu: item.submenu?.map(subItem => ({
      ...subItem,
      current: location.pathname === subItem.href
    }))
  }))

  const handleSubmenuToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }



  return (
    <Disclosure as="nav" className="text-white bg-[#EF6D8D] shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-auto"
                    src="/images/logo-crm.png"
                    alt="CRM Logo"
                  />
                </div>
                
                {/* Desktop navigation */}
                <div className="hidden md:ml-6 lg:block">
  <div className="flex space-x-1 items-center">
    {updatedNavigation.map((item) => (
      <div key={item.name} className="relative group">
        {item.submenu ? (
          <Menu as="div" className="relative">
            <Menu.Button
              className={classNames(
                // Parent active if it is current OR any submenu is current
                item.current || item.submenu.some(sub => sub.current)
                  ? 'bg-white text-[#EF6D8D]' // Active parent style
                  : 'text-white hover:bg-white hover:text-[#EF6D8D] hover:bg-opacity-75',
                'rounded-md px-3 py-2 text-sm font-medium flex items-center'
              )}
            >
              {item.name}
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-grey ring-opacity-5 focus:outline-none">
                {item.submenu.map((subItem) => (
                  <Menu.Item key={subItem.label}>
                    {({ active }) => (
                      <Link
                        to={subItem.href}
                        className={classNames(
                          subItem.current ? 'bg-[#EF6D8D] text-white' : '',
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700 hover:bg-[#EF6D8D] hover:text-white'
                        )}
                      >
                        {subItem.label}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <Link
            to={item.href}
            className={classNames(
              item.current ? 'bg-white text-[#EF6D8D]' : 'text-white hover:bg-white hover:text-[#EF6D8D] hover:bg-opacity-75',
              'rounded-md px-3 py-2 text-sm font-medium'
            )}
          >
            {item.name}
          </Link>
        )}
      </div>
    ))}
  </div>
</div>

              </div>

              {/* Right side elements */}
              <div className="hidden lg:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Tenant selector */}
                  {/* <TenantSelector /> */}
                  
                  {/* Notifications */}
                  <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-black hover:text-gry focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      3
                    </span>
                  </button>

                  {/* Messages */}
                  <button
                    type="button"
                    className="relative ml-3 rounded-full bg-white p-1 text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View messages</span>
                    <EnvelopeIcon className="h-6 w-6" />
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      5
                    </span>
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-[#EF6D8D] text-sm focus:outline-none focus:ring-white focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                        <div className='flex items-center'>
                        <span className="ml-2 text-white">
  {user?.data?.name || "Administrator"}
</span>
                        <ChevronDownIcon className="h-4 w-4 text-white ml-1" />

                        </div>

                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-grey ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/settings"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 cursor-pointer text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  {/* theme selctior button */}
                  {/* <ThemeSelector/> */}

                </div>

              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex lg:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>

          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="xl:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {updatedNavigation.map((item, index) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => handleSubmenuToggle(index)}
                        className={classNames(
                          item.current ? 'bg-pink-700 text-white' : 'text-white hover:bg-pink-500 hover:bg-opacity-75',
                          'flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium'
                        )}
                      >
                        {item.name}
                        <ChevronDownIcon
                          className={classNames(
                            openIndex === index ? 'rotate-180' : '',
                            'h-5 w-5 flex-none'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {openIndex === index && (
                        <div className="mt-2 space-y-2 pl-5">
                          {item.submenu.map((subItem) => (
                            <Disclosure.Button
                              key={subItem.label}
                              as={Link}
                              to={subItem.href}
                              className={classNames(
                                subItem.current ? 'bg-white text-[#ef6d8d]' : 'text-white hover:bg-pink-500 hover:bg-opacity-75',
                                'block rounded-md px-3 py-2 text-base font-medium'
                              )}
                            >
                              {subItem.label}
                            </Disclosure.Button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Disclosure.Button
                      as={Link}
                      to={item.href}
                      className={classNames(
                        item.current ? 'bg-white text-[#ef6d8d]' : 'text-white hover:bg-pink-500 hover:bg-opacity-75',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-white pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">Administrator</div>
                  <div className="text-sm font-medium text-white">admin@example.com</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Disclosure.Button
                  as={Link}
                  to="/profile"
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  as={Link}
                  to="/settings"
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                >
                  Settings
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={handleLogout}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}