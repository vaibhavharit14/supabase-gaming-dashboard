'use client'

import { useState } from 'react'
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function ProofUploader({ winnerId, onUploadSuccess }: { winnerId: string, onUploadSuccess?: () => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [proofUrl, setProofUrl] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // 1. Upload to Supabase Storage (Bucket must be named 'proofs')
      const fileName = `${winnerId}/${Date.now()}-${file.name}`
      const { data: storageData, error: storageErr } = await supabase.storage
        .from('proofs')
        .upload(fileName, file)

      if (storageErr) throw storageErr

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(fileName)

      // 3. Update Winners Table
      const { error: dbErr } = await supabase
        .from('winners')
        .update({ proof_url: publicUrl, verification_status: 'pending' })
        .eq('id', winnerId)

      if (dbErr) throw dbErr

      setProofUrl(publicUrl)
      toast.success("Evidence Uploaded Successfully")
      if (onUploadSuccess) onUploadSuccess()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="glass p-6 border-dashed border-2 border-white/5 flex flex-col items-center gap-4">
      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
         {proofUrl ? <CheckCircle className="text-[var(--accent-teal)] w-6 h-6" /> : (
           isUploading ? <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-gold)]" /> : <Upload className="w-6 h-6 opacity-30" />
         )}
      </div>
      <div className="text-center">
         <h4 className="font-bold text-sm">Upload Result Evidence</h4>
         <p className="text-[10px] text-[var(--text-muted)] mt-1">Image must show date and Stableford total from handicap app.</p>
      </div>

      <input 
        type="file" 
        id={`proof-upload-${winnerId}`}
        className="hidden" 
        disabled={isUploading || !!proofUrl}
        onChange={handleFileChange} 
      />
      
      {!proofUrl ? (
        <label htmlFor={`proof-upload-${winnerId}`} className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-xs font-bold text-center">
          {isUploading ? 'Uploading...' : 'Select File'}
        </label>
      ) : (
        <span className="text-[10px] uppercase font-black text-[var(--accent-teal)] tracking-widest">Awaiting Verification</span>
      )}
    </div>
  )
}
