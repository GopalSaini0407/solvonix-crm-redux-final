import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import React from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', current: false },
  { name: 'Leads', href: '/leads', current: false },
  { name: 'Accounts', href: '/accounts', current: false },
  { name: 'Contacts', href: '/contacts', current: false },
  { name: 'Opportunities', href: '/opportunities', current: false },
  { 
    name: 'Activities', href: '#', current: false,
    submenu: [
      { label: "Tasks", href: "/activities/tasks" },
      { label: "Calendar", href: "/activities/calendar" },
      { label: "Meetings", href: "/activities/meetings" }
    ]
  },
  { 
    name: 'Reports', href: '#', current: false,
    submenu: [
      { label: "Sales Pipeline", href: "/reports/pipeline" },
      { label: "Revenue Forecast", href: "/reports/forecast" },
      { label: "Activity Logs", href: "/reports/activity" }
    ]
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

 function Navbar() {

  const { handleLogout, user } = useAuth()

  const [openIndex, setOpenIndex] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

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
    <Disclosure as="nav" className="bg-(--color-nav-bg) text-(--color-nav-text) shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-8 w-auto" src="/images/logo-crm.png" alt="CRM Logo" />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:ml-6 lg:block">
                  <div className="flex space-x-1 items-center">

                    {updatedNavigation.map((item) => (
                      <div key={item.name} className="relative group">

                        {item.submenu ? (
                          <Menu as="div" className="relative">

                            <Menu.Button
                              className={classNames(
                                item.current || item.submenu.some(sub => sub.current)
                                  ? 'bg-(--color-nav-active-bg) text-(--color-nav-active-text)'
                                  : 'text-(--color-nav-text) hover:bg-(--color-nav-hover-bg) hover:text-(--color-nav-hover-text)',
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
                              <Menu.Items
                                className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-(--color-submenu-bg) shadow-lg ring-1 ring-(--color-border)"
                              >
                                {item.submenu.map((subItem) => (
                                  <Menu.Item key={subItem.label}>
                                    {({ active }) => (
                                      <Link
                                        to={subItem.href}
                                        className={classNames(
                                          subItem.current
                                            ? 'bg-(--color-submenu-active-bg) text-(--color-submenu-active-text)'
                                            : active
                                              ? 'bg-(--color-submenu-hover-bg) text-(--color-submenu-hover-text)'
                                              : 'text-(--color-submenu-text)',
                                          'block px-4 py-2 text-sm rounded'
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
                              item.current
                                ? 'bg-(--color-nav-active-bg) text-(--color-nav-active-text)'
                                : 'text-(--color-nav-text) hover:bg-(--color-nav-hover-bg) hover:text-(--color-nav-hover-text)',
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

              {/* Right side */}
              <div className="hidden lg:block">
                <div className="ml-4 flex items-center md:ml-6">

                  {/* Notifications */}
                  <button
                    type="button"
                    className="relative rounded-full bg-(--color-surface) p-1 text-(--color-text)"
                  >
                    <BellIcon className="h-6 w-6" />
                  </button>

                  {/* Messages */}
                  <button
                    type="button"
                    className="relative ml-3 rounded-full bg-(--color-surface) p-1 text-(--color-text)"
                  >
                    <EnvelopeIcon className="h-6 w-6" />
                  </button>

                  {/* Profile */}
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-(--color-nav-active-bg) text-sm">
                      <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" />
                      <span className="ml-2 text-(--color-nav-active-text) outline-none focus:outline-none">{user?.name || "Administrator"}</span>
                      <ChevronDownIcon className="h-4 w-4 ml-1 text-(--color-nav-active-text)" />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-(--color-submenu-bg) shadow-lg outline-none focus:outline-none ring-1 ring-(--color-border)">
                        <Menu.Item>
                          <Link to="/user-profile" className="block px-4 py-2 text-sm text-(--color-text)">Your Profile</Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link to="/settings" className="block px-4 py-2 text-sm text-(--color-text)">Settings</Link>
                        </Menu.Item>
                        <Menu.Item>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-(--color-text)">
                            Sign out
                            </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>

                  </Menu>

                </div>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex lg:hidden">
                <Disclosure.Button className="p-2 rounded-md text-(--color-nav-text)">
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>

            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="xl:hidden bg-(--color-nav-bg) text-(--color-nav-text)">
            <div className="space-y-1 px-2 pb-3 pt-2">

              {updatedNavigation.map((item, index) => (
                <div key={item.name}>

                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => handleSubmenuToggle(index)}
                        className="flex w-full items-center justify-between px-3 py-2 text-base"
                      >
                        {item.name}
                        <ChevronDownIcon className={classNames(openIndex === index && 'rotate-180', 'h-5 w-5')} />
                      </button>

                      {openIndex === index && (
                        <div className="mt-2 pl-5">

                          {item.submenu.map((subItem) => (
                            <Disclosure.Button
                              key={subItem.label}
                              as={Link}
                              to={subItem.href}
                              className="block px-3 py-2 rounded text-base bg-(--color-submenu-bg) text-(--color-submenu-text) hover:bg-(--color-submenu-hover-bg) hover:text-(--color-submenu-hover-text)"
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
                      className="block rounded-md px-3 py-2 text-base hover:bg-(--color-nav-hover-bg) hover:text-(--color-nav-hover-text)"
                    >
                      {item.name}
                    </Disclosure.Button>
                  )}

                </div>
              ))}

            </div>

            <div className="border-t border-(--color-border) pb-3 pt-4">
              <div className="flex items-center px-5">

                <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" />

                <div className="ml-3">
                  <div className="text-base font-medium">{user?.name || "Administrator"}</div>
                  <div className="text-sm font-medium">{ user?.email || "admin@example.com"}</div>
                </div>

              </div>

              <div className="mt-3 space-y-1 px-2">

                <Disclosure.Button as={Link} to="/user-profile" className="block px-3 py-2 text-base">
                  Your Profile
                </Disclosure.Button>

                <Disclosure.Button as={Link} to="/settings" className="block px-3 py-2 text-base">
                  Settings
                </Disclosure.Button>

                <Disclosure.Button as="button" onClick={handleLogout} className="block w-full px-3 py-2 text-left text-base">
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

export default React.memo(Navbar);