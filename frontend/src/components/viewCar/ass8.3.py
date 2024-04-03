from mpi4py import MPI

# Initialize MPI environment
comm = MPI.COMM_WORLD
rank = comm.Get_rank()
size = comm.Get_size()

# Print out process rank and total number of processes
print(f"Hello from process {rank} out of {size} processes.")

# Finalize MPI environment
MPI.Finalize()
