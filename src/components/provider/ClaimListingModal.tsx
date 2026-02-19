'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@/components/ui/Modal'

interface ClaimForm {
  name: string
  email: string
  role: string
  message: string
}

interface ClaimListingModalProps {
  isOpen: boolean
  onClose: () => void
  clinicId: string
  clinicName: string
}

export default function ClaimListingModal({
  isOpen,
  onClose,
  clinicId,
  clinicName,
}: ClaimListingModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClaimForm>()

  async function onSubmit(data: ClaimForm) {
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicId,
          clinicName,
          ...data,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      reset()
    } catch {
      alert('Something went wrong. Please try again or email us directly.')
    }
  }

  function handleClose() {
    setSubmitted(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Claim This Listing">
      {submitted ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">Request Received!</h3>
          <p className="text-neutral-500 text-sm mb-6">
            We&apos;ll review your claim and reach out within 1-2 business days.
          </p>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-teal text-white font-semibold rounded-xl hover:bg-teal-dark transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-500 mb-6">
            Are you the owner or manager of <strong className="text-neutral-800">{clinicName}</strong>?
            Submit this form and we&apos;ll verify your ownership to unlock full listing management.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                placeholder="Dr. Jane Smith"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                type="email"
                placeholder="you@yourclinic.com"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Your Role
              </label>
              <select
                {...register('role')}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal bg-white"
              >
                <option value="">Select your role</option>
                <option value="owner">Owner / Founder</option>
                <option value="medical-director">Medical Director</option>
                <option value="manager">Practice Manager</option>
                <option value="staff">Staff Member</option>
                <option value="marketing">Marketing / PR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Message (optional)
              </label>
              <textarea
                {...register('message')}
                rows={3}
                placeholder="Anything you'd like us to know or update about this listing…"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-teal text-white font-bold rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                'Submit Claim Request'
              )}
            </button>
          </form>
        </>
      )}
    </Modal>
  )
}
