export default function Loading() {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4285f4] border-r-[#a855f7] border-b-[#ec4899] animate-spin"
              style={{
                background:
                  "linear-gradient(45deg, transparent 40%, rgba(66,133,244,0.1) 45%, rgba(168,85,247,0.1) 55%, rgba(236,72,153,0.1) 65%, transparent 70%)",
              }}
            />
          </div>
          <p className="text-gray-200 text-lg animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }
  
  